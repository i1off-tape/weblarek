import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";

export class Modal extends Component<{}> {
  protected _closeButton: HTMLButtonElement;
  protected _content: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);

    this.container.addEventListener("click", (event: MouseEvent) => {
      if (event.target === this.container) {
        this.close();
      }
    });

    this._closeButton = ensureElement<HTMLButtonElement>(
      ".modal__close",
      this.container
    );
    this._content = ensureElement<HTMLElement>(
      ".modal__content",
      this.container
    );

    this._closeButton.addEventListener("click", () => {
      this.close();
    });
  }

  open(): void {
    this.container.classList.add("modal_active");
  }

  close(): void {
    this.container.classList.remove("modal_active");
  }

  setContent(content: HTMLElement): void {
    this._content.replaceChildren(content);
  }
}
