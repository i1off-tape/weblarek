export type ApiPostMethods = "POST" | "PUT" | "DELETE";

export interface IProduct {
  id: string; // код товара
  description: string; // описание
  image: string; // изображение
  title: string; // название
  category: string; // группа
  price: number | null; // цена или бесценно
}

export type TPayment = "card" | "cash"; // типы оплат
export type PartialBuyer = Partial<IBuyer>;

export interface IBuyer {
  payment: TPayment; // методы оплаты
  email: string; // почта
  phone: string; // телефон
  address: string; // Адрес
}

export interface IProductResponse {
  items: IProduct[];
}

export interface IOrderResponse {
  id?: string; // ID заказа если успешно
  total?: number; // Общая сумма
  error?: string; // Сообщение об ошибке если есть
}

export interface IApi {
  get<T extends object>(uri: string): Promise<T>;
  post<T extends object>(
    uri: string,
    data: object,
    method?: ApiPostMethods
  ): Promise<T>;
}
