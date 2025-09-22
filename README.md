# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:

- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:

- index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/main.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск

Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run dev
```

или

```
yarn
yarn dev
```

## Сборка

```
npm run build
```

или

```
yarn build
```

# Интернет-магазин «Web-Larёk»

«Web-Larёk» — это интернет-магазин с товарами для веб-разработчиков, где пользователи могут просматривать товары, добавлять их в корзину и оформлять заказы. Сайт предоставляет удобный интерфейс с модальными окнами для просмотра деталей товаров, управления корзиной и выбора способа оплаты, обеспечивая полный цикл покупки с отправкой заказов на сервер.

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP (Model-View-Presenter), которая обеспечивает четкое разделение ответственности между классами слоев Model и View. Каждый слой несет свой смысл и ответственность:

Model - слой данных, отвечает за хранение и изменение данных.
View - слой представления, отвечает за отображение данных на странице.
Presenter - презентер содержит основную логику приложения и отвечает за связь представления и данных.

Взаимодействие между классами обеспечивается использованием событийно-ориентированного подхода. Модели и Представления генерируют события при изменении данных или взаимодействии пользователя с приложением, а Презентер обрабатывает эти события используя методы как Моделей, так и Представлений.

### Базовый код

#### Класс Component

Является базовым классом для всех компонентов интерфейса.
Класс является дженериком и принимает в переменной `T` тип данных, которые могут быть переданы в метод `render` для отображения.

Конструктор:
`constructor(container: HTMLElement)` - принимает ссылку на DOM элемент за отображение, которого он отвечает.

Поля класса:
`container: HTMLElement` - поле для хранения корневого DOM элемента компонента.

Методы класса:
`render(data?: Partial<T>): HTMLElement` - Главный метод класса. Он принимает данные, которые необходимо отобразить в интерфейсе, записывает эти данные в поля класса и возвращает ссылку на DOM-элемент. Предполагается, что в классах, которые будут наследоваться от `Component` будут реализованы сеттеры для полей с данными, которые будут вызываться в момент вызова `render` и записывать данные в необходимые DOM элементы.
`setImage(element: HTMLImageElement, src: string, alt?: string): void` - утилитарный метод для модификации DOM-элементов `<img>`

#### Класс Api

Содержит в себе базовую логику отправки запросов.

Конструктор:
`constructor(baseUrl: string, options: RequestInit = {})` - В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.

Поля класса:
`baseUrl: string` - базовый адрес сервера
`options: RequestInit` - объект с заголовками, которые будут использованы для запросов.

Методы:
`get(uri: string): Promise<object>` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер
`post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object>` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.
`handleResponse(response: Response): Promise<object>` - защищенный метод проверяющий ответ сервера на корректность и возвращающий объект с данными полученный от сервера или отклоненный промис, в случае некорректных данных.

#### Класс EventEmitter

Брокер событий реализует паттерн "Наблюдатель", позволяющий отправлять события и подписываться на события, происходящие в системе. Класс используется для связи слоя данных и представления.

Конструктор класса не принимает параметров.

Поля класса:
`_events: Map<string | RegExp, Set<Function>>)` - хранит коллекцию подписок на события. Ключи коллекции - названия событий или регулярное выражение, значения - коллекция функций обработчиков, которые будут вызваны при срабатывании события.

Методы класса:
`on<T extends object>(event: EventName, callback: (data: T) => void): void` - подписка на событие, принимает название события и функцию обработчик.
`emit<T extends object>(event: string, data?: T): void` - инициализация события. При вызове события в метод передается название события и объект с данными, который будет использован как аргумент для вызова обработчика.
`trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие с передачей в него данных из второго параметра.

## Данные

В ходе анализа выявлено что у приложения используются две сущности, которые описывают данные, — товар и покупатель. Их можно описать такими интерфейсами:

### Товар

```typescript
interface IProduct {
  id: string; // код товара
  description: string; // описание
  image: string; // изображение
  title: string; // название
  category: string; // группа
  price: number | null; // цена или бесценно
}
```

### Покупатель

```typescript
interface IBuyer {
  payment: TPayment; // методы оплаты
  email: string; // почта
  phone: string; // телефон
  address: string; // Адрес
}
```

## Модели данных

### Класс CatalogManager

CatalogManager - является классом для управления на главной странице товаров веб-ларька. В его задачи входит:

- Хранение и управление коллекцией товаров
- Работа с выбранной карточкой товара
- Предоставление методов для работы с товарами

Подробнее:

```typescript
class CatalogManager {
  /**
   * Защищенные поля:
   */
  protected products: IProduct[];
  protected selectedProduct: IProduct | null;

  /**
   * Создаем экземпляр менеджера каталога товаров
   * @param initialProducts - Начальный массив товаров для инициализации каталога
   *
   * По умолчанию - пустой массив.
   */
  constructor(initialProducts: IProduct[] = []);

  // Методы класса

  getProductList(): IProduct[]; // Получение списка массива товаров

  saveProductList(products: IProduct[]): void; // Сохранить список товаров

  getSelectedProduct(): IProduct | null; // выбрать конкретный товар

  saveSelectedProduct(product: IProduct): void; // сохранить конкретный товар

  getProductById(id: string): IProduct | undefined; // поиск товара по id
}
```

### Класс CartManager

CartManager - Управляет корзиной с товарами
и отвечает за добавление/удаление товаров, подсчет суммы, список товаров и т.д.

Подробнее:

```typescript
class CartManager {
  // Защищенное поле
  protected items: IProduct[] = []; // Инициализация пустой корзины

  //Методы класса

  addProduct(product: IProduct): void; // добавить товар

  removeProduct(productId: string): boolean; // Удалить товар из корзины по ID

  getProductsCount(): number; // кол-во товаров в корзине

  getProductsList(): IProduct[]; // список товаров в корзине

  getTotalPrice(): number; // общая сумма покупки в корзине

  hasProduct(productId: string): boolean; // Проверить наличие товара в корзине

  clearCart(): void; // очистить корзину
}
```

### Класс BuyerManager

BuyerManager - класс управляет данными покупателя и отвечает за валидацию и хранение данных покупателя.

Подробнее:

```typescript
type TPayment = "card" | "cash"; // типы оплат

class BuyerManager {
  //Защищенное поле
  protected buyer: IBuyer = {
    payment: "card", // значение по-умолчанию!
    email: "",
    phone: "",
    address: "",
  };

  // Методы класса

  getBuyerData(): IBuyer; // получить данные покупателя

  saveBuyerData(buyerData: Partial<IBuyer>): void; // сохранить введённые данные покупателя.

  private validateData(data: IBuyer): boolean; // внутренняя валидация данных

  validationData(): boolean; // вызов валидации данных при сохранении

  clearBuyerData(): void; // Очистка данных пользователя
}
```

## Слой коммуникации

ApiClient - класс будет использовать композицию, чтобы выполнить запросы на сервер с помощью методов из класса Api (соответствующий интерфейсу IApi) и будет получать с сервера объект с массивом товаров и так далее.

Класс выполняет две основные задачи:

- Получение каталога товаров с сервера с помощью GET-запроса на эндпоинт `/product/`. Возвращает объект типа `{ products: IProduct[] }`.
- Отправку заказа на сервер с помощью POST-запроса на эндпоинт `/order/`. Принимает данные в формате `{ products: IProduct[], buyer: IBuyer }` и передаёт их в теле запроса.

Подробнее:

```typescript
class ApiClient {
  //ограничиваем доступ снаружи к функции работе api
  private api: IApi;

  constructor(api: IApi) {
    this.api = api;
  }

  // Получить каталог товаров с сервера
  async getProducts(): Promise<{ products: IProduct[] }>;

  // Отправка заказа на сервер
  async sendOrder(
    products: IProduct[],
    buyer: IBuyer
  ): Promise<{ success: boolean; code: number }>;
}
```

Также написали интерфейсы для удобства.

```typescript
export type TOrderData = {
  products: IProduct[];
  buyer: IBuyer;
};

export interface IProductResponse {
  products: IProduct[];
}

export interface IOrderResponse {
  success: boolean;
  code: boolean;
  orderId?: string;
}
```

## Слой отображения UI

Header

```ts
class Header {
  protected orderButton: HTMLButtonElement;
  protected orderCounts: HTMLElement;
}
```

и интерфейс

```ts
interface HeaderData {
  counter: number;
}
```

```ts
class Gallery {
  protected gallery: HTMLElement;

  set catalog(items: HTMLElement[]);
}
```

и интерфейс

```ts
interface GalleryData {
  catalog: HTMLElement[];
}
```

```ts
class Modal {
  protected modalContent: HTMLElement;
  protected modalButton: HTMLButtonElement;

  set content(items: HTMLElement);
}
```
