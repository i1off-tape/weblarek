import { Form } from "./Form";
import { EventEmitter } from "../base/Events";

interface IOrderFormData {
  payment: string;
  address: string;
}

export class OrderForm extends Form<IOrderFormData> {
  constructor(events: EventEmitter) {
    super("#order", events);
    this.initPaymentButtons();

    // Добавляем отладку
    events.on("order:submit", (data) => {
      console.log("🔍 OrderForm heard order:submit:", data);
    });
  }

  private initPaymentButtons(): void {
    const paymentButtons = this.container.querySelectorAll(".button_alt");

    paymentButtons.forEach((button) => {
      button.addEventListener("click", () => {
        console.log("💳 Payment button clicked:", button.getAttribute("name"));

        // Убираем активный класс у всех кнопок
        paymentButtons.forEach((btn) =>
          btn.classList.remove("button_alt-active")
        );
        // Добавляем активный класс к выбранной кнопке
        button.classList.add("button_alt-active");
        this.validateForm();
      });
    });
  }

  protected validateForm(): void {
    const errors: string[] = [];
    const addressInput = this.container.querySelector(
      '[name="address"]'
    ) as HTMLInputElement;
    const paymentButton = this.container.querySelector(".button_alt-active");

    console.log("🔍 Validating order form:", {
      address: addressInput?.value,
      payment: paymentButton?.getAttribute("name"),
      hasPayment: !!paymentButton,
    });

    const addressValue = addressInput?.value.trim() || "";
    if (!addressValue) {
      errors.push("Введите адрес доставки");
    } else if (addressValue.length <= 5) {
      errors.push("Адрес слишком короткий (минимум 6 символов)");
    }

    if (!paymentButton) {
      errors.push("Выберите способ оплаты");
    }

    this.setErrors(errors);
    console.log("📋 Validation errors:", errors);
  }

  protected getFormData(): IOrderFormData {
    const activeButton = this.container.querySelector(".button_alt-active");
    const addressInput = this.container.querySelector(
      '[name="address"]'
    ) as HTMLInputElement;

    const data = {
      payment: activeButton?.getAttribute("name") || "",
      address: addressInput?.value || "",
    };

    console.log("📦 Order form data:", data);
    return data;
  }

  render(data?: Partial<{ valid: boolean; errors: string[] }>): HTMLElement {
    console.log("🔄 Rendering order form");
    this.reset();
    return super.render(data);
  }
}
