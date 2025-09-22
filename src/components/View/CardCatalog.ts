import { Card } from "../View/Card.ts";
import { IProduct } from "../../types";

export class CardCatalog extends Card {
  constructor(container: HTMLElement) {
    super(container, "#card-catalog");
  }

  render(data: IProduct): HTMLElement {
    const fragment = this.createTemplate(); // Это DocumentFragment

    // ИСПРАВЛЕНИЕ: Извлекаем первый корневой элемент
    const card = fragment.firstElementChild as HTMLElement;
    if (!card) {
      throw new Error("Card template has no root element");
    }

    card.setAttribute("data-id", data.id);

    this.setText(".card__title", data.title, card);
    this.setCategory(".card__category", data.category, card);
    this.setImageSrc(".card__image", data.image, card);
    this.setPrice(".card__price", data.price, card);

    return card;
  }
}
