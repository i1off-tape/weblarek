import "./scss/styles.scss";
import { CatalogManager } from "./components/Models/CatalogManager";
import { CartManager } from "./components/Models/CartManager";
import { BuyerManager } from "./components/Models/BuyerManager";
import { Api } from "./components/base/Api.ts";
import { ApiClient } from "./components/Models/ApiClient.ts";
import { API_URL } from "./utils/constants";
import { Header } from "./components/View/Header.ts";
import { Gallery } from "./components/View/Gallery.ts";
import { CardCatalog } from "./components/View/CardCatalog.ts";
import { EventEmitter } from "./components/base/Events.ts";
import { ensureElement } from "./utils/utils";
import { Basket } from "./components/View/Basket.ts";
import { Modal } from "./components/View/Modal.ts";
import { OrderForm } from "./components/View/OrderForm.ts";
import { ContactsForm } from "./components/View/ContactsForm.ts";
import { Success } from "./components/View/Success.ts";
import { CardPreview } from "./components/View/CardPreview.ts";
import { IProduct, IOrderResponse, TPayment, IBuyer } from "./types/index.ts";
import { CardBasket } from "./components/View/CardBasket.ts";

// ОБЯЗАТЕЛЬНО: обернуть в DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
  // Инициализация компонентов и моделей
  const events = new EventEmitter();
  const api = new Api(API_URL);
  const apiClient = new ApiClient(api, events);

  const cartManager = new CartManager(events);
  const buyerManager = new BuyerManager(events);
  const catalogManager = new CatalogManager(events);

  // Компоненты, которые используют существующие DOM-элементы
  const modal = new Modal(ensureElement<HTMLElement>("#modal-container"));
  const gallery = new Gallery(ensureElement<HTMLElement>(".gallery"), events);
  const header = new Header(events, ensureElement<HTMLElement>(".header"));

  // Компоненты, создающиеся из шаблонов
  const basket = new Basket(events);
  const basketElement = basket.render();
  const success = new Success(events);
  const orderForm = new OrderForm(events);
  const contactsForm = new ContactsForm(events);

  // Загрузка товаров при запуске
  apiClient
    .getProducts()
    .then((data) => {
      catalogManager.saveProductList(data.items);
    })
    .catch((error) => {
      console.error("❌ API Error:", error); // ДОБАВИТЬ
    });

  // ОБРАБОТЧИКИ СОБЫТИЙ

  // Каталог товаров - ПОЛНЫЙ обработчик
  events.on("catalog:changed", (items: IProduct[]) => {
    const cards = items.map((item) => {
      const cardCatalog = new CardCatalog(document.createElement("div"));
      const card = cardCatalog.render(item);

      // добавляем обработчик клика на КАРТОЧКУ
      card.addEventListener("click", () => {
        events.emit("card:select", { id: item.id });
      });

      return card;
    });

    gallery.catalog = cards;
  });

  // Просмотр товара
  events.on("catalog:productSelected", (product: IProduct) => {
    const cardPreview = new CardPreview(document.createElement("div"), events);
    cardPreview.setButtonState(cartManager.hasProduct(product.id));
    const preview = cardPreview.render(product);
    modal.setContent(preview);
    modal.open();
  });

  // Корзина
  events.on("cart:changed", (items: IProduct[]) => {
    header.counter = items.length;
    const basketItems = items.map((item, index) => {
      const cardContainer = document.createElement("div");
      const cardBasket = new CardBasket(cardContainer, events);
      return cardBasket.render(item, index);
    });
    basket.items = basketItems;
    basket.total = cartManager.getTotalPrice();
  });

  events.on("basket:open", () => {
    events.emit("cart:changed", cartManager.getProductsList());
    modal.setContent(basketElement);
    modal.open();
  });

  events.on("basket:remove", (data: { id: string }) => {
    cartManager.removeProduct(data.id);
  });

  // Обновляем обработчики
  events.on("basket:checkout", () => {
    // Просто показываем форму
    const orderFormElement = orderForm.render();
    modal.setContent(orderFormElement);
  });

  // Изменение данных

  events.on("buyer:cleared", () => {
    orderForm.clearForm();
    contactsForm.clearForm();
    orderForm.render({ valid: false, errors: [] });
    contactsForm.render({ valid: false, errors: [] });
  });

  events.on("contacts:changed", (data: { email: string; phone: string }) => {
    try {
      buyerManager.updateContactsData(data.email, data.phone);
      // Если успешно - очищаем ошибки
      contactsForm.render({ valid: true, errors: [] });
    } catch (error) {
      // Показываем конкретные ошибки из модели
      const errorMessage =
        error instanceof Error ? error.message : "Ошибка валидации";
      contactsForm.render({
        valid: false,
        errors: errorMessage.split(", "), // Разделяем ошибки по запятой
      });
    }
  });

  events.on("order:changed", (data: { payment: TPayment; address: string }) => {
    try {
      buyerManager.updateOrderData(data.payment, data.address);
      // Если успешно - очищаем ошибки
      orderForm.render({ valid: true, errors: [] });
    } catch (error) {
      // Показываем конкретные ошибки из модели
      const errorMessage =
        error instanceof Error ? error.message : "Ошибка валидации";
      orderForm.render({
        valid: false,
        errors: errorMessage.split(", "), // Разделяем ошибки по запятой
      });
    }
  });

  // Формы
  events.on("order:submit", () => {
    const buyerData = buyerManager.getBuyerData();
    const errors = buyerManager.validateOrderDataWithErrors(
      buyerData.payment,
      buyerData.address
    );

    if (errors.length === 0) {
      // Переходим к форме контактов
      const contactsFormElement = contactsForm.render();
      modal.setContent(contactsFormElement);
    } else {
      // Показываем конкретные ошибки из модели
      orderForm.render({
        valid: false,
        errors: errors, // Используем массив ошибок из модели
      });
    }
  });

  events.on("contacts:submit", () => {
    const errors = buyerManager.validateContactsDataWithErrors();

    if (errors.length === 0 && buyerManager.validateData()) {
      const products = cartManager.getProductsList();
      const total = cartManager.getTotalPrice();
      const buyerData = buyerManager.getBuyerData();

      apiClient
        .sendOrder(products, buyerData)
        .then((response: IOrderResponse) => {
          if (response.id) {
            const successElement = success.render({
              total: response.total || total,
            });
            modal.setContent(successElement);

            cartManager.clearCart();
            buyerManager.clearBuyerData();
          } else {
            console.error("❌ Order creation failed - no order ID in response");
          }
        })
        .catch((error) => {
          console.error("❌ Order error:", error.message);
          alert("Ошибка при оформлении заказа: " + error.message);
        });
    } else {
      // Показываем конкретные ошибки контактов
      const contactErrors = buyerManager.validateContactsDataWithErrors();
      contactsForm.render({
        valid: false,
        errors: contactErrors,
      });
      console.error("❌ Buyer data validation failed");
    }
  });

  // Модальные окна
  events.on("success:close", () => {
    modal.close();
  });

  events.on("modal:close", () => {
    modal.close();
  });

  // Карточки товаров
  events.on("card:select", (data: { id: string }) => {
    const product = catalogManager.getProductById(data.id);

    if (product) {
      events.emit("catalog:productSelected", product);
    } else {
      console.error(`Product with ID ${data.id} not found`);
    }
  });

  events.on("card:addToBasket", (data: { id: string }) => {
    const product = catalogManager.getProductById(data.id);
    if (product) {
      cartManager.addProduct(product);
      modal.close();
    }
  });
}); // Конец DOMContentLoaded
