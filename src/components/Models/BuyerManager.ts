import { IBuyer, TPayment } from "../../types/index.ts";
import { EventEmitter } from "../base/Events.ts";

export class BuyerManager {
  protected buyer: IBuyer = {
    payment: "card",
    email: "",
    phone: "",
    address: "",
  };

  constructor(protected events: EventEmitter) {
    this.validate();
  }

  // Устанавливаем данные заказа и валидируем
  setOrderData(data: Partial<{ payment: TPayment; address: string }>): void {
    if (data.payment) {
      this.buyer.payment = data.payment;
    }
    if (data.address !== undefined) {
      this.buyer.address = data.address;
    }
    this.validate();
  }

  // Устанавливаем контактные данные и валидируем
  setContactsData(data: Partial<{ email: string; phone: string }>): void {
    if (data.email !== undefined) {
      this.buyer.email = data.email;
    }
    if (data.phone !== undefined) {
      this.buyer.phone = data.phone;
    }
    this.validate();
  }

  // Валидация всех данных
  validate(): void {
    const errors: Record<string, string> = {};

    // Валидация заказа
    if (!this.buyer.payment) {
      errors.payment = "Выберите способ оплаты";
    } else if (this.buyer.payment !== "card" && this.buyer.payment !== "cash") {
      errors.payment = "Некорректный способ оплаты";
    }

    if (!this.buyer.address.trim()) {
      errors.address = "Введите адрес доставки";
    } else if (this.buyer.address.trim().length <= 5) {
      errors.address = "Адрес должен содержать более 5 символов";
    }

    // Валидация контактов
    if (!this.buyer.email.trim()) {
      errors.email = "Введите email";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.buyer.email)) {
        errors.email = "Некорректный формат email";
      }
    }

    if (!this.buyer.phone.trim()) {
      errors.phone = "Введите номер телефона";
    } else {
      const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
      if (!phoneRegex.test(this.buyer.phone)) {
        errors.phone = "Некорректный формат телефона";
      }
    }

    this.events.emit("errors:show", errors);
  }

  // Проверка валидности заказа
  isOrderValid(): boolean {
    const hasPayment =
      this.buyer.payment &&
      (this.buyer.payment === "card" || this.buyer.payment === "cash");
    const hasValidAddress = this.buyer.address.trim().length > 5;

    return hasPayment && hasValidAddress;
  }

  // Проверка валидности контактов
  isContactsValid(): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;

    return (
      emailRegex.test(this.buyer.email) && phoneRegex.test(this.buyer.phone)
    );
  }

  getBuyerData(): IBuyer {
    return { ...this.buyer };
  }

  clearBuyerData(): void {
    this.buyer = {
      payment: "card",
      email: "",
      phone: "",
      address: "",
    };
    this.events.emit("buyer:cleared");
    this.validate();
  }
}
