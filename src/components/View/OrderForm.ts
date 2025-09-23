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

    // Обработчик для кнопок оплаты
    this._paymentButtons.forEach((button) => {
      button.addEventListener("click", () => {
        this._paymentButtons.forEach((btn) =>
          btn.classList.remove("button_alt-active")
        );
        button.classList.add("button_alt-active");
        const payment = button.getAttribute("name") || "";
        // Отправляем данные в BuyerManager при выборе оплаты
        this.events.emit("order:change", {
          payment,
          address: this._addressInput.value.trim(),
        });
        this.updateButtonState();
      });
    });

    // Обработчик для поля адреса
    this._addressInput.addEventListener("input", () => {
      // Отправляем данные в BuyerManager при изменении адреса
      this.events.emit("order:change", {
        payment:
          this.container
            .querySelector(".button_alt-active")
            ?.getAttribute("name") || "",
        address: this._addressInput.value.trim(),
      });
      this.updateButtonState();
    });

    // Обработчик отправки формы
    this._submitButton.addEventListener("click", (event: Event) => {
      event.preventDefault();
      this.events.emit("order:submit", {
        payment:
          this.container
            .querySelector(".button_alt-active")
            ?.getAttribute("name") || "",
        address: this._addressInput.value.trim(),
      });
    });

    // Устанавливаем кнопку "card" как активную по умолчанию
    const defaultPaymentButton = this.container.querySelector('[name="card"]');
    if (defaultPaymentButton) {
      defaultPaymentButton.classList.add("button_alt-active");
    }
  }

  // НОВЫЙ МЕТОД: очистка формы
  clearForm(): void {
    this._addressInput.value = "";
    // Сбрасываем активную кнопку оплаты
    this._paymentButtons.forEach((btn) =>
      btn.classList.remove("button_alt-active")
    );
    // Устанавливаем кнопку "card" как активную по умолчанию
    const defaultPaymentButton = this.container.querySelector('[name="card"]');
    if (defaultPaymentButton) {
      defaultPaymentButton.classList.add("button_alt-active");
    }
    this._submitButton.disabled = true;
    this.setErrors([]);
  }

  private isValidAddress(address: string): boolean {
    // Адрес должен быть длиннее 5 символов (согласно BuyerManager)
    return address.trim().length > 5;
  }

  private isValidPayment(payment: string): boolean {
    // Проверяем, что выбран способ оплаты (card или cash)
    return payment === "card" || payment === "cash";
  }

  public updateButtonState(): void {
    const payment =
      this.container
        .querySelector(".button_alt-active")
        ?.getAttribute("name") || "";
    const address = this._addressInput.value.trim();
    const isPaymentValid = this.isValidPayment(payment);
    const isAddressValid = this.isValidAddress(address);

    // Кнопка активна только если оба поля валидны
    this._submitButton.disabled = !(isPaymentValid && isAddressValid);

    // Формируем ошибки
    const errors: string[] = [];
    if (!payment) {
      errors.push("Выберите способ оплаты");
    } else if (!isPaymentValid) {
      errors.push("Некорректный способ оплаты");
    }
    if (address.length === 0) {
      errors.push("Введите адрес");
    } else if (!isAddressValid) {
      errors.push("Адрес должен быть длиннее 5 символов");
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
