import { IProduct } from "../../types/index.ts";
import { Card } from "../View/Card.ts";
import { EventEmitter } from "../base/Events.ts";

export class CardPreview extends Card {
  protected events: EventEmitter;
  protected isInCart: boolean = false;

  constructor(container: HTMLElement, events: EventEmitter) {
    super(container, "#card-preview");
    this.events = events;
  }

  setButtonState(isInCart: boolean): void {
    this.isInCart = isInCart;
  }

  render(data: IProduct): HTMLElement {
    const card = this.createTemplate();

    this.setImageSrc(".card__image", data.image, card);
    this.setCategory(".card__category", data.category, card);
    this.setText(".card__title", data.title, card);
    this.setText(".card__text", data.description, card);
    this.setPrice(".card__price", data.price, card);

    const button = card.querySelector(".card__button") as HTMLButtonElement;
    if (button) {
      if (data.price === null) {
        button.textContent = "Недоступно";
        button.disabled = true;
      } else {
        button.textContent = this.isInCart ? "Удалить из корзины" : "В корзину";
        this.setButtonListeners(button, data.id);
      }
    }

    return card;
  }

  protected setButtonListeners(
    button: HTMLButtonElement,
    productId: string
  ): void {
    button.addEventListener("click", () => {
      if (button.textContent === "Удалить из корзины") {
        this.events.emit("basket:remove", { id: productId });
        this.events.emit("modal:close");
      } else {
        this.events.emit("card:addToBasket", { id: productId });
        this.events.emit("modal:close");
      }
    });
  }
}
