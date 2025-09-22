import { Form } from "./Form";
import { EventEmitter } from "../base/Events";

interface IContactsFormData {
  email: string;
  phone: string;
}

export class ContactsForm extends Form<IContactsFormData> {
  constructor(events: EventEmitter) {
    super("#contacts", events);
  }

  protected validateForm(): void {
    const errors: string[] = [];
    const emailInput = this.container.querySelector(
      '[name="email"]'
    ) as HTMLInputElement;
    const phoneInput = this.container.querySelector(
      '[name="phone"]'
    ) as HTMLInputElement;

    if (!emailInput?.value.trim()) {
      errors.push("Введите email");
    } else if (!this.isValidEmail(emailInput.value)) {
      errors.push("Введите корректный email");
    }

    if (!phoneInput?.value.trim()) {
      errors.push("Введите телефон");
    } else if (!this.isValidPhone(phoneInput.value)) {
      errors.push("Введите корректный телефон");
    }

    this.setErrors(errors);
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private isValidPhone(phone: string): boolean {
    // Простая проверка телефона - минимум 10 цифр
    const digits = phone.replace(/\D/g, "");
    return digits.length >= 10;
  }

  protected getFormData(): IContactsFormData {
    const emailInput = this.container.querySelector(
      '[name="email"]'
    ) as HTMLInputElement;
    const phoneInput = this.container.querySelector(
      '[name="phone"]'
    ) as HTMLInputElement;

    return {
      email: emailInput?.value || "",
      phone: phoneInput?.value || "",
    };
  }

  render(data?: Partial<{ valid: boolean; errors: string[] }>): HTMLElement {
    this.reset();
    return super.render(data);
  }
}
