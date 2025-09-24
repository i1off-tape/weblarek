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

    // Обработчики для полей
    this._emailInput.addEventListener("input", () => {
      const email = this._emailInput.value.trim();
      this.events.emit("contacts:change", { email });
    });

    this._phoneInput.addEventListener("input", () => {
      const phone = this._phoneInput.value.trim();
      this.events.emit("contacts:change", { phone });
    });

    // Обработчик отправки формы
    this._submitButton.addEventListener("click", (event) => {
      event.preventDefault();
      this.events.emit("contacts:submit");
    });
  }

  // Сбрасываем визуальное состояние формы
  resetForm(): void {
    this._emailInput.value = "";
    this._phoneInput.value = "";
    this.events.emit("contacts:change", { email: "", phone: "" });
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
