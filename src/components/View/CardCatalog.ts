import { Card } from "../View/Card.ts";
import { IProduct } from "../../types";
import { EventEmitter } from "../base/Events.ts";

export class CardCatalog extends Card {
  protected events: EventEmitter;

  constructor(container: HTMLElement, events: EventEmitter) {
    super(container, "#card-catalog");
    this.events = events;
  }

  render(data: IProduct): HTMLElement {
    const card = this.createTemplate();

    card.setAttribute("data-id", data.id);

    this.setText(".card__title", data.title, card);
    this.setCategory(".card__category", data.category, card);
    this.setImageSrc(".card__image", data.image, card);
    this.setPrice(".card__price", data.price, card);

    card.addEventListener("click", () => {
      this.events.emit("card:select", { id: data.id });
    });

    return card;
  }
}
