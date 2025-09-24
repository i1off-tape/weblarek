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

    // Обработчик для кнопок оплаты
    this._paymentButtons.forEach((button) => {
      button.addEventListener("click", () => {
        this._paymentButtons.forEach((btn) =>
          btn.classList.remove("button_alt-active")
        );
        button.classList.add("button_alt-active");

        const payment = (button.getAttribute("name") || "card") as TPayment;
        this.events.emit("order:change", { payment });
      });
    });

    // Обработчик для поля адреса
    this._addressInput.addEventListener("input", () => {
      const address = this._addressInput.value.trim();
      this.events.emit("order:change", { address });
    });

    // Обработчик отправки формы
    this._submitButton.addEventListener("click", (event: Event) => {
      event.preventDefault();
      this.events.emit("order:submit");
    });

    // Устанавливаем кнопку "card" как активную по умолчанию
    const defaultPaymentButton = this.container.querySelector('[name="card"]');
    if (defaultPaymentButton) {
      defaultPaymentButton.classList.add("button_alt-active");
      this.events.emit("order:change", { payment: "card" });
    }
  }

  // Сбрасываем визуальное состояние формы
  resetForm(): void {
    this._addressInput.value = "";
    this._paymentButtons.forEach((btn) =>
      btn.classList.remove("button_alt-active")
    );
    const defaultPaymentButton = this.container.querySelector('[name="card"]');
    if (defaultPaymentButton) {
      defaultPaymentButton.classList.add("button_alt-active");
    }
    this.events.emit("order:change", { payment: "card", address: "" });
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
