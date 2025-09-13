import {
  IApi,
  IProduct,
  IBuyer,
  IProductResponse,
  TOrderData,
  IOrderResponse,
} from "../../types/index.ts";

export class ApiClient {
  private api: IApi;

  constructor(api: IApi) {
    this.api = api;
  }

  async getProducts(): Promise<IProductResponse> {
    return this.api.get<IProductResponse>("/product/");
  }

  async sendOrder(items: IProduct[], buyer: IBuyer): Promise<IOrderResponse> {
    const orderData: TOrderData = { items, buyer };
    return this.api.post<IOrderResponse>("/order/", orderData);
  }
}
