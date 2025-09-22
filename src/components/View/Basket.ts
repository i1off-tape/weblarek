import { Component } from "../base/Component";
import { EventEmitter } from "../base/Events";
import { ensureElement } from "../../utils/utils";
import { IProduct } from "../../types";
import { CardBasket } from "./CardBasket";

interface IBasketView {
  items: IProduct[];
  total: number;
}

export class Basket extends Component<IBasketView> {
  protected _list: HTMLElement;
  protected _total: HTMLElement;
  protected _button: HTMLButtonElement;
  protected events: EventEmitter;

  constructor(events: EventEmitter) {
    // Создаем элемент из шаблона вместо поиска в DOM
    const template = document.querySelector("#basket") as HTMLTemplateElement;
    if (!template) throw new Error("Basket template not found");

    const basketNode = template.content.querySelector(".basket");
    if (!basketNode) {
      throw new Error("Required element .basket not found in #basket template");
    }
    const container = basketNode.cloneNode(true) as HTMLElement;
    super(container);

    this.events = events;
    this._list = ensureElement<HTMLElement>(".basket__list", this.container);
    this._total = ensureElement<HTMLElement>(".basket__price", this.container);
    this._button = ensureElement<HTMLButtonElement>(
      ".basket__button",
      this.container
    );

    this._button.addEventListener("click", () => {
      events.emit("basket:checkout");
    });

    this._list.addEventListener("click", (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const button = target.closest(".basket__item-delete");
      if (button) {
        const item = button.closest(".basket__item") as HTMLElement;
        if (item && item.dataset.id) {
          events.emit("basket:remove", { id: item.dataset.id });
        }
      }
    });
  }

  set items(items: IProduct[]) {
    this._list.innerHTML = "";

    if (items.length === 0) {
      this._list.innerHTML = '<p class="basket__empty">Корзина пуста</p>';
      this._button.disabled = true;
      return;
    }

    this._button.disabled = false;

    items.forEach((item, index) => {
      const cardContainer = document.createElement("div");
      const cardBasket = new CardBasket(cardContainer);
      const card = cardBasket.render(item);

      const indexElement = card.querySelector(".basket__item-index");
      if (indexElement) {
        indexElement.textContent = (index + 1).toString();
      }

      this._list.appendChild(card);
    });
  }

  set total(total: number) {
    this._total.textContent = `${total} синапсов`;
  }

  render(data?: Partial<IBasketView>): HTMLElement {
    // Если переданы данные, обновляем их
    if (data?.items) {
      this.items = data.items;
    }
    if (data?.total !== undefined) {
      this.total = data.total;
    }

    // Возвращаем обновленный контейнер
    return super.render(data);
  }
}
