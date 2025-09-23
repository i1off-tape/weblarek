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
import { IProduct, IOrderResponse, TPayment } from "./types/index.ts";

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
    const cardCatalog = new CardCatalog(document.createElement("div"));
    const cards = items.map((item) => {
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
    const cardPreview = new CardPreview(document.createElement("div"));
    const preview = cardPreview.render(product);

    // Добавляем кнопку "В корзину"
    const button = preview.querySelector(".card__button");
    if (button && product.price !== null) {
      const isInCart = cartManager.hasProduct(product.id);
      if (isInCart) {
        button.textContent = "Удалить из корзины";
        button.addEventListener("click", () => {
          events.emit("basket:remove", { id: product.id }); // Используем существующий событие удаления
          modal.close();
        });
      } else {
        button.textContent = "В корзину";
        button.addEventListener("click", () => {
          events.emit("card:addToBasket", { id: product.id });
          modal.close();
        });
      }
    }

    modal.setContent(preview);
    modal.open();
  });

  // Корзина
  events.on("cart:changed", (items: IProduct[]) => {
    header.counter = items.length;
    basket.items = items;
    basket.total = cartManager.getTotalPrice();
  });

  events.on("basket:open", () => {
    basket.items = cartManager.getProductsList();
    basket.total = cartManager.getTotalPrice();

    modal.setContent(basketElement);
    modal.open();
  });

  events.on("basket:remove", (data: { id: string }) => {
    cartManager.removeProduct(data.id);
    catalogManager.saveProductList(catalogManager.getProductList());
  });

  // Обновляем обработчики
  events.on("basket:checkout", () => {
    // Используем render для сброса и обновления формы
    const orderFormElement = orderForm.render({
      valid: false,
      errors: ["Заполните форму"],
    });
    modal.setContent(orderFormElement);
  });

  // Формы
  events.on("order:submit", (data: { payment: TPayment; address: string }) => {
    try {
      // Сохраняем только адрес и способ оплаты
      buyerManager.saveBuyerData({
        payment: data.payment,
        address: data.address,
        // email и phone остаются пустыми - это нормально на этом этапе
      });
    } catch (error) {
      // Показываем ошибку пользователю
      const orderFormElement = orderForm.render({
        valid: false,
        errors: ["Проверьте введенные данные"],
      });
      modal.setContent(orderFormElement);
      return;
    }

    const contactsFormElement = contactsForm.render({
      valid: false,
      errors: ["Заполните контактные данные"],
    });
    modal.setContent(contactsFormElement);
  });

  events.on("contacts:submit", (data: { email: string; phone: string }) => {
    const buyerData = {
      ...buyerManager.getBuyerData(),
      email: data.email,
      phone: data.phone,
    };

    buyerManager.saveBuyerData(buyerData);

    if (buyerManager.validationData()) {
      const products = cartManager.getProductsList();
      const total = cartManager.getTotalPrice();

      apiClient
        .sendOrder(products, buyerData)
        .then((response: IOrderResponse) => {
          // ПРАВИЛЬНАЯ ПРОВЕРКА: если есть id - заказ успешно создан
          if (response.id) {
            // Показываем окно успеха с общей суммой из ответа API
            const successElement = success.render({
              total: response.total || total,
            });
            modal.setContent(successElement);

            // Очищаем корзину после успешного заказа
            cartManager.clearCart();
            buyerManager.clearBuyerData(); // Очищаем данные покупателя
          } else {
            console.error("❌ Order creation failed - no order ID in response");
            // Можно показать сообщение об ошибке пользователю
          }
        })
        .catch((error) => {
          console.error("❌ Order error:", error.message);
          // Показать ошибку пользователю
          alert("Ошибка при оформлении заказа: " + error.message);
        });
    } else {
      console.error("❌ Buyer data validation failed");
      alert("Проверьте правильность введенных данных");
    }
  });

  // Модальные окна
  events.on("success:close", () => {
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
      catalogManager.saveProductList(catalogManager.getProductList());
    }
  });
}); // Конец DOMContentLoaded
