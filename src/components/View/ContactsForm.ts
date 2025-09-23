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

    this._emailInput.addEventListener("input", () => {
      this.updateButtonState();
    });

    this._phoneInput.addEventListener("input", () => {
      this.updateButtonState();
    });

    this._submitButton.addEventListener("click", (event) => {
      event.preventDefault();
      events.emit("contacts:submit", {
        email: this._emailInput.value.trim(),
        phone: this._phoneInput.value.trim(),
      });
    });
  }

  private updateButtonState(): void {
    const hasEmail = this._emailInput.value.trim().length > 0;
    const hasPhone = this._phoneInput.value.trim().length > 0;
    this._submitButton.disabled = !(hasEmail && hasPhone);
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
