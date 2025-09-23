import { Component } from "../base/Component";
import { EventEmitter } from "../base/Events";
import { ensureElement } from "../../utils/utils";
import { IProduct } from "../../types";
import { CardBasket } from "./CardBasket";

interface IBasketView {
  items: HTMLElement[];
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
  }

  set items(items: HTMLElement[]) {
    this._list.innerHTML = "";

    if (items.length === 0) {
      this._list.innerHTML = '<p class="basket__empty">Корзина пуста</p>';
      this._button.disabled = true;
      return;
    }

    this._button.disabled = false;
    items.forEach((item) => {
      this._list.appendChild(item);
    });
  }

  set total(total: number) {
    this._total.textContent = `${total} синапсов`;
  }

  render(): HTMLElement {
    return this.container;
  }
}
