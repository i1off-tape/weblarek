import { IProduct } from "../../types/index.ts";
import { Card } from "../View/Card.ts";

export class CardPreview extends Card {
  constructor(container: HTMLElement) {
    super(container, "#card-preview");
  }

  render(data: IProduct): HTMLElement {
    const card = this.createTemplate();

    this.setImageSrc(".card__image", data.image, card);
    this.setCategory(".card__category", data.category, card);
    this.setText(".card__title", data.title, card);
    this.setText(".card__text", data.description, card);
    this.setPrice(".card__price", data.price, card);

    const button = card.querySelector(".card__button") as HTMLButtonElement;
    if (data.price === null) {
      button.textContent = "Недоступно";
      button.disabled = true;
    }

    return card;
  }
}
