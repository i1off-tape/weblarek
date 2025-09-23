import { Form } from "./Form";
import { EventEmitter } from "../base/Events";
import { ensureElement } from "../../utils/utils";

interface IOrderFormData {
  payment: string;
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

    this._paymentButtons.forEach((button) => {
      button.addEventListener("click", () => {
        this._paymentButtons.forEach((btn) =>
          btn.classList.remove("button_alt-active")
        );
        button.classList.add("button_alt-active");
        this.updateButtonState();
      });
    });

    this._addressInput.addEventListener("input", () => {
      this.updateButtonState();
    });

    this._submitButton.addEventListener("click", (event: Event) => {
      event.preventDefault();
      events.emit("order:submit", {
        payment:
          this.container
            .querySelector(".button_alt-active")
            ?.getAttribute("name") || "",
        address: this._addressInput.value.trim(),
      });
    });
  }

  private updateButtonState(): void {
    const hasPayment = !!this.container.querySelector(".button_alt-active");
    const hasAddress = this._addressInput.value.trim().length > 0;
    this._submitButton.disabled = !(hasPayment && hasAddress);
    this.setErrors(this._submitButton.disabled ? ["Заполните форму"] : []);
  }

  render(data?: Partial<{ valid: boolean; errors: string[] }>): HTMLElement {
    this.reset();
    if (data?.errors) {
      this.setErrors(data.errors);
    }
    if (data?.valid !== undefined) {
      this._submitButton.disabled = !data.valid;
    }
    return this.container;
  }
}
