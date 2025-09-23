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

      try {
        this.events.emit("contacts:changed", { email, phone });
        this.setErrors([]);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Ошибка валидации";
        this.setErrors([errorMessage]);
      }

      this.updateButtonState();
    });

    this._phoneInput.addEventListener("input", () => {
      const email = this._emailInput.value.trim();
      const phone = this._phoneInput.value.trim();

      try {
        this.events.emit("contacts:changed", { email, phone });
        this.setErrors([]);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Ошибка валидации";
        this.setErrors([errorMessage]);
      }

      this.updateButtonState();
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

  public updateButtonState(): void {
    const email = this._emailInput.value.trim();
    const phone = this._phoneInput.value.trim();

    // Базовая проверка заполненности полей
    const isEmailFilled = email.length > 0;
    const isPhoneFilled = phone.length > 0;

    this._submitButton.disabled = !(isEmailFilled && isPhoneFilled);
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
