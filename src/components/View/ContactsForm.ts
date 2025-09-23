import { Form } from "./Form";
import { EventEmitter } from "../base/Events";
import { ensureElement } from "../../utils/utils";

interface IContactsFormData {
  email: string;
  phone: string;
}

export class ContactsForm extends Form<IContactsFormData> {
  protected _emailInput: HTMLInputElement;
  protected _phoneInput: HTMLInputElement;
  protected _submitButton: HTMLButtonElement;

  constructor(events: EventEmitter) {
    super("#contacts", events);

    this._emailInput = ensureElement<HTMLInputElement>(
      '[name="email"]',
      this.container
    );
    this._phoneInput = ensureElement<HTMLInputElement>(
      '[name="phone"]',
      this.container
    );
    this._submitButton = ensureElement<HTMLButtonElement>(
      'button[type="submit"]',
      this.container
    );

    // Обработчики для полей - сразу отправляем в модель
    this._emailInput.addEventListener("input", () => {
      const email = this._emailInput.value.trim();
      const phone = this._phoneInput.value.trim();

      this.events.emit("contacts:changed", { email, phone });
    });

    this._phoneInput.addEventListener("input", () => {
      const email = this._emailInput.value.trim();
      const phone = this._phoneInput.value.trim();

      this.events.emit("contacts:changed", { email, phone });
    });

    // Обработчик отправки формы - теперь только отправка заказа
    this._submitButton.addEventListener("click", (event) => {
      event.preventDefault();
      events.emit("contacts:submit");
    });
  }

  clearForm(): void {
    this._emailInput.value = "";
    this._phoneInput.value = "";
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
