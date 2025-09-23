import { Form } from "./Form";
import { EventEmitter } from "../base/Events";
import { ensureElement } from "../../utils/utils";
import { TPayment } from "../../types";

interface IOrderFormData {
  payment: TPayment;
  address: string;
}

export class OrderForm extends Form<IOrderFormData> {
  protected _addressInput: HTMLInputElement;
  protected _paymentButtons: NodeListOf<HTMLButtonElement>;
  protected _submitButton: HTMLButtonElement;

  constructor(events: EventEmitter) {
    super("#order", events);

    this._addressInput = ensureElement<HTMLInputElement>(
      '[name="address"]',
      this.container
    );
    this._paymentButtons = this.container.querySelectorAll(".button_alt");
    this._submitButton = ensureElement<HTMLButtonElement>(
      'button[type="submit"]',
      this.container
    );

    // Обработчик для кнопок оплаты - сразу отправляем в модель
    this._paymentButtons.forEach((button) => {
      button.addEventListener("click", () => {
        this._paymentButtons.forEach((btn) =>
          btn.classList.remove("button_alt-active")
        );
        button.classList.add("button_alt-active");

        const payment = (button.getAttribute("name") || "card") as TPayment;
        const address = this._addressInput.value.trim();

        this.events.emit("order:changed", { payment, address });
      });
    });

    // Обработчик для поля адреса - сразу отправляем в модель
    this._addressInput.addEventListener("input", () => {
      const paymentButton = this.container.querySelector(".button_alt-active");
      const payment = (paymentButton?.getAttribute("name") ||
        "card") as TPayment;
      const address = this._addressInput.value.trim();

      this.events.emit("order:changed", { payment, address });
    });

    // Обработчик отправки формы - теперь только навигация
    this._submitButton.addEventListener("click", (event: Event) => {
      event.preventDefault();
      this.events.emit("order:submit");
    });

    // Устанавливаем кнопку "card" как активную по умолчанию
    const defaultPaymentButton = this.container.querySelector('[name="card"]');
    if (defaultPaymentButton) {
      defaultPaymentButton.classList.add("button_alt-active");
    }
  }

  clearForm(): void {
    this._addressInput.value = "";
    this._paymentButtons.forEach((btn) =>
      btn.classList.remove("button_alt-active")
    );

    const defaultPaymentButton = this.container.querySelector('[name="card"]');
    if (defaultPaymentButton) {
      defaultPaymentButton.classList.add("button_alt-active");
    }

    this._submitButton.disabled = true;
    this.setErrors([]);
  }

  render(data?: Partial<{ valid: boolean; errors: string[] }>): HTMLElement {
    if (data?.errors) {
      this.setErrors(data.errors);
    }
    if (data?.valid !== undefined) {
      this._submitButton.disabled = !data.valid;
    }
    return this.container;
  }
}
