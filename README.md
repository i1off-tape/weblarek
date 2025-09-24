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
  protected items: IProduct[] = [];
  protected selectedProduct: IProduct | null = null;

  /**
   * Создаем экземпляр менедыжера каталога товаров
   * @param initialProducts - Начальный массив товаров для инициализации каталога
   *
   * По умолчанию - пустой массив.
   */
  constructor(protected events: EventEmitter);

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
  // Защищённое поле
  protected buyer: IBuyer = {
    payment: "card", // Способ оплаты по умолчанию
    email: "", // Пустой email
    phone: "", // Пустой телефон
    address: "", // Пустой адрес
  };

  // Конструктор
  constructor(protected events: EventEmitter); // Инициализирует с EventEmitter и запускает валидацию

  // ОСНОВНЫЕ МЕТОДЫ ВАЛИДАЦИИ
  validate(): void; // Проверяет все данные (payment, address, email, phone) и отправляет ошибки через событие errors:show

  // ВСПОМОГАТЕЛЬНЫЕ МЕТОДЫ (boolean)
  isOrderValid(): boolean; // Проверяет валидность заказа (payment — card/cash, address > 5 символов)
  isContactsValid(): boolean; // Проверяет валидность контактов (email и phone соответствуют regex)

  // ОБНОВЛЕНИЕ ДАННЫХ (вызывается при изменении полей)
  setOrderData(data: Partial<{ payment: TPayment; address: string }>): void; // Обновляет данные заказа (payment, address) и запускает валидацию
  setContactsData(data: Partial<{ email: string; phone: string }>): void; // Обновляет контактные данные (email, phone) и запускает валидацию

  // ДОПОЛНИТЕЛЬНЫЕ МЕТОДЫ
  getBuyerData(): IBuyer; // Возвращает копию текущих данных покупателя
  clearBuyerData(): void; // Сбрасывает данные покупателя (payment на "card", остальные — пустые) и вызывает событие buyer:cleared
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
   async getProducts(): Promise<IProductResponse>;

  // Отправка заказа на сервер
  async sendOrder(items: IProduct[], buyer: IBuyer): Promise<IOrderResponse>
```

Также написали интерфейсы для удобства.

```typescript
export interface IProductResponse {
  products: IProduct[];
}

export interface IOrderResponse {
  id?: string; // ID заказа если успешно
  total?: number; // Общая сумма
  error?: string; // Сообщение об ошибке если есть
}
```

## Слой отображения UI

1. Header - Компонент для отображения шапки сайта с счётчиком товаров в корзине и кнопкой открытия корзины.

```ts
class Header {
  protected orderButton: HTMLButtonElement; //кнопка корзины
  protected orderCounts: HTMLElement; // счётчик товаров.

  constructor(protected events: IEvents, container: HTMLElement);

  set counter(value: number); // установить значение счётчик
}
```

и интерфейс

```ts
interface HeaderData {
  counter: number; // Для счётчика
}
```

2. Gallery - Компонент для отображения галереи товаров в каталоге.

```ts
class Gallery {

  protected events: EventEmitter; - эмиттер событий.
  constructor(container: HTMLElement, events: EventEmitter)

  get itemsCount(): number // получить количество карточек товаров в галерее.

  set catalog(items: HTMLElement[]); установить карточки товаров.
}
```

и интерфейс

```ts
interface IGalleryData {
  catalog: HTMLElement[];
}
```

3. Modal - Компонент для управления модальными окнами, включая открытие, закрытие и установку содержимого.

```ts
class Modal {
  protected _closeButton: HTMLButtonElement; // кнопка закрытия.
  protected _content: HTMLElement; //контейнер содержимого.

  constructor(container: HTMLElement);

  private disableBodyScroll(): void; // отключение скролла

  private enableBodyScroll(): void; // // включение скролла

  open(): void; // открыть модальное окно

  close(): void; // закрыть модальное окно

  setContent(content: HTMLElement): void; // установить содержимое
}
```

4. Card - Абстрактный базовый класс для карточек товаров (каталог, корзина, предпросмотр).

```ts
class Card {
  protected templateId: string; // - ID шаблона

  constructor(container: HTMLElement, templateId: string);

  protected createTemplate(); // создать элемент из шаблона.

  protected setText(selector: string, text: string, parent: HTMLElement): void; // установить текст

  protected setImageSrc( // установить изображение
    selector: string,
    src: string,
    parent: HTMLElement
  ): void;

  protected setPrice( // установить цену
    selector: string,
    price: number | null,
    parent: HTMLElement
  ): void;

  protected setCategory( // установить категорию
    selector: string,
    category: string,
    parent: HTMLElement
  ): void;

  private getCategoryClass(category: string): string; // получить фоновый цвет категории.

  abstract render(data: IProduct): HTMLElement; // абстрактный метод рендеринга.
}
```

4.1 CardCatalog - Наследник `Card` для карточек в каталоге.

```ts
class CardCatalog {
  constructor(container: HTMLElement); // - вызывает супер с шаблоном "#card-catalog".

  render(data: IProduct): HTMLElement; // - рендерит карточку с названием, категорией, изображением и ценой.
}
```

4.2 CardBasket - Наследник `Card` для карточек в корзине.

```ts
class CardBasket {
  constructor(container: HTMLElement, protected events: EventEmitter);

  render(data: IProduct): HTMLElement; // рендерит карточку с названием и ценой
}
```

4.3 CardPreview - Наследник `Card` для отображения детальной информации о товаре в модальном окне.

```ts
class CardPreview {
  constructor(container: HTMLElement, events: EventEmitter);

  setButtonState(isInCart: boolean): void; // - устанавливает состояние кнопки (в корзине/не в корзине)

  protected setButtonListeners(
    button: HTMLButtonElement,
    productId: string
  ): void; // - добавляет обработчики клика на кнопку (удаление из корзины или добавление)

  render(data: IProduct): HTMLElement {}
  // рендерит карточку с описанием, изображением, названием, категорией, ценой и кнопкой «Купить» (или «Недоступно» для товаров с `price === null`).
}
```

5. Form - Абстрактный базовый класс для форм (заказ, контакты).

```ts
class Form {
  protected events: EventEmitter; // - эмиттер.
  protected _submit: HTMLButtonElement; // - кнопка submit.
  protected _errors: HTMLElement; // - блок ошибок

  constructor(templateId: string, events: EventEmitter); // - принимает ID шаблона и эмиттер.

  protected setErrors(errors: string[]): void; // - установить ошибки и отключить кнопку.
}
```

и интерфейс

```ts
interface IFormState {
  valid: boolean;
  errors: string[];
}
```

5.1 OrderForm - Наследник `Form` для формы оформления заказа (первый шаг: оплата и адрес).

```ts
class OrderForm {
  protected _addressInput: HTMLInputElement;
  protected _paymentButtons: NodeListOf<HTMLButtonElement>;
  protected _submitButton: HTMLButtonElement;

  constructor(events: EventEmitter) {}

  resetForm(): void; // - только отражает состояние модели

  render(data?: Partial<{ valid: boolean; errors: string[] }>): HTMLElement; // - рендерит форму с сбросом данных.
}
```

И интерфейс:

```ts
interface IOrderFormData {
  payment: string;
  address: string;
}
```

5.2 ContactsForm - Наследник `Form` для формы контактов (второй шаг: email и телефон).

```ts
class ContactsForm {
  protected _emailInput: HTMLInputElement;
  protected _phoneInput: HTMLInputElement;
  protected _submitButton: HTMLButtonElement;

  constructor(events: EventEmitter) {}

  resetForm(): void; // - только отражает состояние модели

  render(data?: Partial<{ valid: boolean; errors: string[] }>): HTMLElement; // - рендерит форму с сбросом данных.
}
```

и интерфейс:

```ts
interface IContactsFormData {
  email: string;
  phone: string;
}
```

6. Basket - Компонент для отображения корзины с товарами, итоговой суммой и кнопкой оформления заказа.

```ts
class Basket {
  protected _list: HTMLElement; // - контейнер для списка товаров.
  protected _total: HTMLElement; // - элемент для отображения итоговой суммы.
  protected _button: HTMLButtonElement; // - кнопка оформления заказа.
  protected events: EventEmitter; // - эмиттер событий.

  constructor(events: EventEmitter) {}

  set items(items: HTMLElement[]): void; // - устанавливает список товаров в корзине как DOM-элементы
  set total(total: number): void; //  - устанавливает итоговую сумму в формате «X синапсов».
  render(data?: Partial<IBasketView>): HTMLElement; // - рендерит корзину с обновлением списка товаров и суммы.
}
```

и интерфейс

```ts
interface IBasketView {
  items: HTMLElement[];
  total: number;
}
```

7. Success - Компонент для отображения сообщения об успешном оформлении заказа с указанием списанной суммы.

```ts
class Success {
  protected _close: HTMLElement; // - кнопка закрытия.
  protected _total: HTMLElement; // - элемент для отображения списанной суммы.
  protected events: EventEmitter; // - эмиттер событий.

  constructor(events: EventEmitter) {}

  set total(total: number): void; // - устанавливает текст в формате «Списано X синапсов».
  render(data?: Partial<ISuccess>): HTMLElement; // - рендерит компонент с обновлением суммы (унаследовано от `Component`).
}
```

И интерфейс:

```ts
interface ISuccess {
  total: number;
}
```

## События приложения

В приложении используется событийно-ориентированный подход для взаимодействия между слоями MVP. События генерируются через `EventEmitter` и обрабатываются в `main.ts` или соответствующих компонентах. Ниже перечислены все события, их назначение и передаваемые данные:

- `catalog:changed`: Генерируется при обновлении списка товаров в `CatalogManager`. Передаёт массив товаров (`IProduct[]`).
- `catalog:productSelected`: Генерируется при выборе товара для просмотра. Передаёт данные товара (`IProduct`).
- `cart:changed`: Генерируется при изменении корзины (добавление, удаление, очистка) в `CartManager`. Передаёт массив товаров в корзине (`IProduct[]`).
- `buyer:changed`: Генерируется при обновлении данных покупателя в `BuyerManager`. Передаёт данные покупателя (`IBuyer`).
- `buyer:cleared`: Генерируется при очистке данных покупателя в `BuyerManager`. Не передаёт данные.
- `basket:open`: Генерируется при клике на кнопку корзины в `Header`. Не передаёт данные.
- `basket:checkout`: Генерируется при клике на кнопку оформления заказа в `Basket`. Не передаёт данные.
- `basket:remove`: Генерируется при удалении товара из корзины в `Basket`. Передаёт ID товара (`{ id: string }`).
- `order:submit`: только навигация между формами (данные уже в модели)
- `contacts:submit`: отправка заказа (данные уже в модели)
- `success:close`: Генерируется при закрытии окна успеха в `Success`. Не передаёт данные.
- `modal:close`: Генерируется при закрытии модального окна. Не передаёт данные.
- `card:select`: Генерируется при клике на карточку товара в каталоге. Передаёт ID товара (`{ id: string }`).
- `card:addToBasket`: Генерируется при добавлении товара в корзину из превью. Передаёт ID товара ({ id: string }).
- `buyer:cleared`: Сбрасывает данные покупателя в модели (BuyerManager) и формы (OrderForm, ContactsForm). Без данных.
- `contacts:change`: Обновляет контактные данные (email, phone) в модели при их изменении в форме.
- `order:change`: Обновляет данные заказа (payment, address) в модели при их изменении в форме.
- `errors:show`: Передаёт ошибки валидации из модели в формы для отображения.

## Презентер

Презентер реализован в файле `main.ts` и отвечает за основную логику приложения в архитектуре MVP. Он обеспечивает взаимодействие между моделями данных (`CatalogManager`, `CartManager`, `BuyerManager`, `ApiClient`) и представлениями (`Header`, `Gallery`, `Modal`, `Basket`, `OrderForm`, `ContactsForm`, `Success`) через событийно-ориентированный подход с использованием `EventEmitter`.
