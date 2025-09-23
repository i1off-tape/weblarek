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

    // ОДИН обработчик для email
    this._emailInput.addEventListener("input", () => {
      this.events.emit("contacts:change", {
        email: this._emailInput.value.trim(),
        phone: this._phoneInput.value.trim(),
      });
      this.updateButtonState();
    });

    // ОДИН обработчик для phone
    this._phoneInput.addEventListener("input", () => {
      this.events.emit("contacts:change", {
        email: this._emailInput.value.trim(),
        phone: this._phoneInput.value.trim(),
      });
      this.updateButtonState();
    });

    // Обработчик отправки формы
    this._submitButton.addEventListener("click", (event) => {
      event.preventDefault();
      events.emit("contacts:submit", {
        email: this._emailInput.value.trim(),
        phone: this._phoneInput.value.trim(),
      });
    });
  }

  // НОВЫЙ МЕТОД: очистка формы
  clearForm(): void {
    this._emailInput.value = "";
    this._phoneInput.value = "";
    this._submitButton.disabled = true;
    this.setErrors([]);
  }

  private isValidEmail(email: string): boolean {
    // Упрощенное регулярное выражение для email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private isValidPhone(phone: string): boolean {
    // Упрощенное регулярное выражение для телефона
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    return (
      phoneRegex.test(phone.replace(/\D/g, "")) &&
      phone.replace(/\D/g, "").length >= 10
    );
  }

  public updateButtonState(): void {
    const email = this._emailInput.value.trim();
    const phone = this._phoneInput.value.trim();
    const isEmailValid = this.isValidEmail(email);
    const isPhoneValid = this.isValidPhone(phone);

    // Кнопка активна только если оба поля заполнены и валидны
    this._submitButton.disabled = !(isEmailValid && isPhoneValid);

    // Устанавливаем ошибки, если данные некорректны
    const errors: string[] = [];
    if (email.length === 0) {
      errors.push("Введите email");
    } else if (!isEmailValid) {
      errors.push("Некорректный формат email");
    }
    if (phone.length === 0) {
      errors.push("Введите номер телефона");
    } else if (!isPhoneValid) {
      errors.push("Некорректный формат телефона");
    }

    this.setErrors(errors);
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
