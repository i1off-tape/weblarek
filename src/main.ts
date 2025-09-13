import "./scss/styles.scss";
import { CatalogManagerTest } from "./components/Models/CatalogManager";
import { CartManagerTest } from "./components/Models/CartManager";
import { BuyerManagerTest } from "./components/Models/BuyerManager";
import { Api } from "./components/base/Api.ts";
import { ApiClient } from "./components/Models/ApiClient.ts";
import { API_URL } from "./utils/constants";
import { apiProducts } from "./utils/data.ts";

//Тесты

const productsModel = new CatalogManagerTest();
productsModel.saveProductList(apiProducts.items);
const selectedProductTest = productsModel.getProductList()[1];
productsModel.saveSelectedProduct(selectedProductTest);

const cartPerson = new CartManagerTest();
cartPerson.addProduct(apiProducts.items[0]);
cartPerson.addProduct(apiProducts.items[1]);

const personBuyer = new BuyerManagerTest();

//api
const api = new Api(API_URL);
const apiClient = new ApiClient(api);
async function loadProducts() {
  try {
    const response = await apiClient.getProducts();
    console.log("Продукты, полученные с API:", response);
    productsModel.saveProductList(response.items);
    console.log(
      "Сохранённые продукты в productsModel из API:",
      productsModel.getProductList()
    );
  } catch (error) {
    console.error("Ошибка при получении продуктов с API:", error);
  }
}

//Каталог
console.log("ПРОВЕРКА РАБОТЫ МЕТОДОВ КЛАССА CatalogManagerTest");
console.log("Весь массив из каталога data.ts:", productsModel.getProductList());
console.log("Поиск существующего товара:");
console.log("ID: b06cde61-912f-4663-9751-09956c0eed67");
console.log(
  "Результат:",
  productsModel.getProductById("b06cde61-912f-4663-9751-09956c0eed67")
);
console.log("---");
console.log("Поиск НЕсуществующего товара:");
console.log("ID: 123");
console.log("Результат:", productsModel.getProductById("123"));
console.log("СОХРАНЯЕМ И ПОЛУЧАЕМ ТОВАР");
console.log("Результат сохранения товара:", productsModel.getSelectedProduct());
console.log("----");

// Корзина
console.log("ПРОВЕРКА РАБОТЫ МЕТОДОВ КЛАССА CartManagerTest");
console.log("Добавляем 2 товара в корзину");
console.log("Текущий список товаров в корзине:", cartPerson.getProductsList());
console.log(
  "Общее количество товаров в корзине:",
  cartPerson.getProductsCount()
);
console.log("Общая стоимость товаров в корзине:", cartPerson.getTotalPrice());
console.log("Проверяем наличие товара в корзине по ID:");
console.log(
  "ID: c101ab44-ed99-4a54-990d-47aa2bb4e7d9",
  cartPerson.hasProduct("c101ab44-ed99-4a54-990d-47aa2bb4e7d9")
);
console.log("ID: 123", cartPerson.hasProduct("123"));
console.log("Удаляем товар из корзины по ID:");
console.log(
  "ID: 854cef69-976d-4c2a-a18c-2aa45046c390",
  cartPerson.removeProduct("854cef69-976d-4c2a-a18c-2aa45046c390")
);
console.log("Текущий список товаров в корзине:", cartPerson.getProductsList());
console.log("Очистка корзины");
cartPerson.clearCart();
console.log("Текущий список товаров в корзине:", cartPerson.getProductsList());
console.log("----");

// Покупатель

console.log("ПРОВЕРКА РАБОТЫ МЕТОДОВ КЛАССА BuyerManagerTest");
console.log(
  "Получаем данные покупателя по-умолчанию:",
  personBuyer.getBuyerData()
);
console.log(
  "Проверка валидации данных по-умолчанию:",
  personBuyer.validationData()
);
console.log("Сохраняем НЕкорректные данные покупателя:");
try {
  personBuyer.saveBuyerData({
    payment: "cash",
    email: "yandexRulit", // некорректный email
    phone: "79991234567", // некорректный телефон
    address: "ул. Ленина, д. 1", // некорректный адрес
  });
} catch (error) {
  console.error(
    "Ошибка при сохранении данных покупателя:",
    (error as Error).message
  );
  console.log("Сохраняем корректные данные покупателя:");
  personBuyer.saveBuyerData({
    payment: "cash",
    email: "yandexRulit@yandex.ru",
    phone: "+79991234567",
    address: "г. Москва, ул. Ленина, д. 1",
  });
  console.log(
    "Получаем сохранённые данные покупателя:",
    personBuyer.getBuyerData()
  );
  console.log(
    "Проверка валидации сохранённых данных:",
    personBuyer.validationData()
  );
}

loadProducts();
