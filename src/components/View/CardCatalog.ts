import { Card } from "../View/Card.ts";
import { IProduct } from "../../types";

export class CardCatalog extends Card {
  constructor(container: HTMLElement) {
    super(container, "#card-catalog");
  }

  render(data: IProduct): HTMLElement {
    const card = this.createTemplate();

    card.setAttribute("data-id", data.id);

    this.setText(".card__title", data.title, card);
    this.setCategory(".card__category", data.category, card);
    this.setImageSrc(".card__image", data.image, card);
    this.setPrice(".card__price", data.price, card);

    return card;
  }
}
