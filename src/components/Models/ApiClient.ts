import {
  IApi,
  IProduct,
  IBuyer,
  IProductResponse,
  IOrderResponse,
} from "../../types/index.ts";

import { EventEmitter } from "../base/Events.ts";

export class ApiClient {
  private api: IApi;

  constructor(api: IApi, protected events: EventEmitter) {
    this.api = api;
  }

  async getProducts(): Promise<IProductResponse> {
    try {
      this.events.emit("api:productsLoading");
      const products = await this.api.get<IProductResponse>("/product/");
      this.events.emit("api:productsLoaded", products);
      return products;
    } catch (error) {
      this.events.emit("api:productsError", { error });
      throw error;
    }
  }

  async sendOrder(items: IProduct[], buyer: IBuyer): Promise<IOrderResponse> {
    try {
      this.events.emit("api:orderSending", { items, buyer });

      // ПРАВИЛЬНЫЙ ФОРМАТ ДЛЯ API
      const orderData = {
        payment: buyer.payment === "card" ? "online" : "upon_receipt", // преобразуем в формат API
        email: buyer.email,
        phone: buyer.phone,
        address: buyer.address,
        total: items.reduce((sum, item) => sum + (item.price || 0), 0),
        items: items.map((item) => item.id), // только ID товаров
      };

      const response = await this.api.post<IOrderResponse>(
        "/order/",
        orderData
      );
      this.events.emit("api:orderSent", response);
      return response;
    } catch (error) {
      this.events.emit("api:orderError", { error });
      throw error;
    }
  }
}
