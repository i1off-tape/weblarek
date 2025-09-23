import { Card } from "./Card.ts";
import { IProduct } from "../../types/index.ts";

export class CardBasket extends Card {
  constructor(container: HTMLElement) {
    super(container, "#card-basket");
  }

  render(data: IProduct): HTMLElement {
    const card = this.createTemplate();

    // Теперь работаем с элементом, а не с фрагментом
    card.dataset.id = data.id;

    this.setText(".card__title", data.title, card);
    this.setPrice(".card__price", data.price, card);

    return card;
  }
}
