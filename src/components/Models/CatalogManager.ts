import { IProduct } from "../../types/index.ts";
import { EventEmitter } from "../base/Events.ts";

export class CatalogManager {
  protected items: IProduct[] = [];
  protected selectedProduct: IProduct | null = null;

  constructor(protected events: EventEmitter) {}

  getProductList(): IProduct[] {
    return this.items;
  }

  saveProductList(newItems: IProduct[]): void {
    this.items = newItems;
    this.events.emit("catalog:changed", this.items);
  }

  getSelectedProduct(): IProduct | null {
    return this.selectedProduct;
  }

  saveSelectedProduct(product: IProduct): void {
    this.selectedProduct = product;
    this.events.emit("catalog:selectedProductChanged", product);
  }

  getProductById(id: string): IProduct | undefined {
    return this.items.find((item: IProduct) => item.id === id);
  }
}
