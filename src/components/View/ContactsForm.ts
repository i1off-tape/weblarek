import { Form } from "./Form";
import { EventEmitter } from "../base/Events";

interface IContactsFormData {
  email: string;
  phone: string;
}

export class ContactsForm extends Form<IContactsFormData> {
  constructor(events: EventEmitter) {
    super("#contacts", events); // передаем ID шаблона
  }

  protected validateForm(): void {
    const errors: string[] = [];
    const email = this.container.querySelector(
      '[name="email"]'
    ) as HTMLInputElement;
    const phone = this.container.querySelector(
      '[name="phone"]'
    ) as HTMLInputElement;

    if (!email.value) errors.push("Введите email");
    if (!phone.value) errors.push("Введите телефон");

    this.setErrors(errors);
  }

  protected getFormData(): IContactsFormData {
    return {
      email: (
        this.container.querySelector('[name="email"]') as HTMLInputElement
      ).value,
      phone: (
        this.container.querySelector('[name="phone"]') as HTMLInputElement
      ).value,
    };
  }
}
