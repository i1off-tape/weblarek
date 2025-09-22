import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";

export interface IHeaderData {
  counter: number;
}

export class Header extends Component<IHeaderData> {
  protected basketButton: HTMLButtonElement;
  protected counterElement: HTMLElement;

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container);

    this.counterElement = ensureElement<HTMLElement>(
      ".header__basket-counter",
      this.container
    );
    this.basketButton = ensureElement<HTMLButtonElement>(
      ".header__basket",
      this.container
    );

    this.basketButton.addEventListener("click", () => {
      this.events.emit("basket:open");
    });
  }

  set counter(value: number) {
    this.counterElement.textContent = String(value);
  }
}
