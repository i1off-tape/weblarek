import { Card } from "./Card.ts";
import { IProduct } from "../../types/index.ts";

export class CardBasket extends Card {
  constructor(container: HTMLElement) {
    super(container, "#card-basket");
  }

  render(data: IProduct): HTMLElement {
    const fragment = this.createTemplate();

    // Получаем элемент из фрагмента
    const card = fragment.firstElementChild as HTMLElement;
    if (!card) {
      throw new Error("Card element not found in template");
    }

    // Теперь работаем с элементом, а не с фрагментом
    card.dataset.id = data.id;

    this.setText(".card__title", data.title, card);
    this.setPrice(".card__price", data.price, card);

    return card;
  }
}
