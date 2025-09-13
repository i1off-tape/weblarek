import { IProduct } from "../../types/index.ts";

/* Будущий используемый класс CatalogManager
class CatalogManager {
  protected products: IProduct[];
  protected selectedProduct: IProduct | null;

  constructor(initialProducts: IProduct[] = []) {
    this.products = initialProducts;
  }

  getProductList(): IProduct[] {}

  saveSelectedProduct(product: IProduct): void {}

}
*/

//Тест

export class CatalogManagerTest {
  protected items: IProduct[] = [];
  protected selectedProduct: IProduct | null;

  constructor() {
    this.selectedProduct = null;
  }

  getProductList(): IProduct[] {
    return this.items;
  }

  saveProductList(newItems: IProduct[]): void {
    this.items = newItems;
  }

  getSelectedProduct(): IProduct | null {
    return this.selectedProduct;
  }

  saveSelectedProduct(product: IProduct): void {
    this.selectedProduct = product;
  }

  getProductById(id: string): IProduct | undefined {
    return this.items.find((item: IProduct) => item.id === id);
  }
}
