import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import { EventEmitter } from "../base/Events";

interface ISuccess {
  total: number;
}

export class Success extends Component<ISuccess> {
  protected _close: HTMLElement;
  protected _total: HTMLElement;
  protected events: EventEmitter;

  constructor(events: EventEmitter) {
    const template = document.querySelector("#success") as HTMLTemplateElement;
    if (!template) throw new Error("Success template not found");

    const content = template.content.cloneNode(true) as DocumentFragment;
    const container = content.firstElementChild as HTMLElement;

    if (!container) {
      throw new Error("Success template is empty");
    }

    super(container);

    this.events = events;
    this._close = ensureElement<HTMLElement>(
      ".order-success__close",
      this.container
    );
    this._total = ensureElement<HTMLElement>(
      ".order-success__description",
      this.container
    );

    this._close.addEventListener("click", () => {
      this.events.emit("success:close");
    });
  }

  set total(total: number) {
    this._total.textContent = `Списано ${total} синапсов`;
  }
}
