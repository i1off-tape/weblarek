import { IProduct } from "../../types/index.ts";

// Тест
export class CartManagerTest {
  protected items: IProduct[] = [];

  addProduct(product: IProduct): void {
    this.items.push({ ...product });
  }

  removeProduct(productId: string): boolean {
    const initialLength = this.items.length;
    this.items = this.items.filter((item: IProduct) => item.id !== productId);
    return this.items.length < initialLength;
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
    this.items = [];
  }
}
