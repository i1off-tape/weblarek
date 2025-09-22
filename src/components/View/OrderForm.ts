import { Form } from "./Form";
import { EventEmitter } from "../base/Events";

interface IOrderFormData {
  payment: string;
  address: string;
}

export class OrderForm extends Form<IOrderFormData> {
  constructor(events: EventEmitter) {
    super("#order", events); // передаем ID шаблона

    this.container.addEventListener("click", (e: Event) => {
      const target = e.target as HTMLElement;
      const button = target.closest(".button_alt") as HTMLElement;

      if (button) {
        this.container.querySelectorAll(".button_alt").forEach((btn) => {
          btn.classList.remove("button_alt-active");
        });
        button.classList.add("button_alt-active");
        this.validateForm();
      }
    });
  }

  protected validateForm(): void {
    const errors: string[] = [];
    const address = this.container.querySelector(
      '[name="address"]'
    ) as HTMLInputElement;
    const payment = this.container.querySelector(".button_alt.button_selected");

    if (!address.value) errors.push("Введите адрес");
    if (!payment) errors.push("Выберите способ оплаты");

    this.setErrors(errors);
  }

  protected getFormData(): IOrderFormData {
    return {
      payment:
        this.container
          .querySelector(".button_alt.button_selected")
          ?.getAttribute("name") || "",
      address: (
        this.container.querySelector('[name="address"]') as HTMLInputElement
      ).value,
    };
  }
}
