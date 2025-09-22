import { IProduct } from "../../types/index.ts";
import { EventEmitter } from "../base/Events.ts";

// Тест
export class CartManager {
  protected items: IProduct[] = [];

  constructor(protected events: EventEmitter) {}

  addProduct(product: IProduct): void {
    this.items.push({ ...product });
    this.events.emit("cart:changed", this.items);
    this.events.emit("cart:productAdded", product);
  }

  removeProduct(productId: string): boolean {
    const initialLength = this.items.length;
    const removedProduct = this.items.find(
      (item: IProduct) => item.id === productId
    );
    this.items = this.items.filter((item: IProduct) => item.id !== productId);

    if (this.items.length < initialLength) {
      this.events.emit("cart:changed", this.items);
      this.events.emit("cart:productRemoved", removedProduct);
      return true;
    }
    return false;
  }

  getProductsCount(): number {
    return this.items.length;
  }

  getProductsList(): IProduct[] {
    return this.items;
  }

  getTotalPrice(): number {
    return this.items.reduce(
      (total: number, items: IProduct) => total + (items.price ?? 0),
      0
    );
  }

  hasProduct(productId: string): boolean {
    return this.items.some((item: IProduct) => item.id === productId);
  }

  clearCart(): void {
    const clearedItems = [...this.items];
    this.items = [];
    this.events.emit("cart:cleared", clearedItems);
    this.events.emit("cart:changed", this.items);
  }
}
