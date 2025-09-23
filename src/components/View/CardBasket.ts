import { Card } from "./Card.ts";
import { IProduct } from "../../types/index.ts";
import { EventEmitter } from "../base/Events.ts";

export class CardBasket extends Card {
  constructor(container: HTMLElement, protected events: EventEmitter) {
    super(container, "#card-basket");
  }

  render(data: IProduct, index?: number): HTMLElement {
    const card = this.createTemplate();
    card.dataset.id = data.id;

    this.setText(".card__title", data.title, card);
    this.setPrice(".card__price", data.price, card);
    if (index !== undefined) {
      this.setText(".basket__item-index", (index + 1).toString(), card);
    }

    const deleteButton = card.querySelector(".basket__item-delete");
    if (deleteButton) {
      deleteButton.replaceWith(deleteButton.cloneNode(true));
      const newDeleteButton = card.querySelector(
        ".basket__item-delete"
      ) as HTMLElement;
      newDeleteButton.addEventListener("click", () => {
        this.events.emit("basket:remove", { id: data.id });
      });
    }

    return card;
  }
}
