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
    if (!this.container.classList.contains("modal_active")) {
      this.container.classList.add("modal_active");
      this.disableBodyScroll();
    }
  }

  close(): void {
    this.container.classList.remove("modal_active");
    this.enableBodyScroll();
  }

  setContent(content: HTMLElement): void {
    // Сбрасываем состояние скролла перед установкой нового содержимого
    if (this.container.classList.contains("modal_active")) {
      this.enableBodyScroll();
    }
    this._content.replaceChildren(content);
    // Если модальное окно должно остаться открытым, снова включаем блокировку скролла
    if (this.container.classList.contains("modal_active")) {
      this.disableBodyScroll();
    }
  }

  private disableBodyScroll(): void {
    const scrollBarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = `${scrollBarWidth}px`; // предотвращает смещение контента
  }

  private enableBodyScroll(): void {
    document.body.style.overflow = "";
    document.body.style.paddingRight = "";
  }
}
