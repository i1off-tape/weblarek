import { IBuyer, TPayment } from "../../types/index.ts";
import { EventEmitter } from "../base/Events.ts";

export class BuyerManager {
  protected buyer: IBuyer = {
    payment: "card",
    email: "",
    phone: "",
    address: "",
  };

  constructor(protected events: EventEmitter) {}

  // Детальная валидация заказа с конкретными ошибками
  validateOrderDataWithErrors(payment?: TPayment, address?: string): string[] {
    const actualPayment = payment || this.buyer.payment;
    const actualAddress = address !== undefined ? address : this.buyer.address;
    const errors: string[] = [];

    if (!actualPayment) {
      errors.push("Выберите способ оплаты");
    } else if (actualPayment !== "card" && actualPayment !== "cash") {
      errors.push("Некорректный способ оплаты");
    }

    if (!actualAddress.trim()) {
      errors.push("Введите адрес доставки");
    } else if (actualAddress.trim().length <= 5) {
      errors.push("Адрес должен содержать более 5 символов");
    }

    return errors;
  }

  // Детальная валидация контактов с конкретными ошибками
  validateContactsDataWithErrors(email?: string, phone?: string): string[] {
    const actualEmail = email !== undefined ? email : this.buyer.email;
    const actualPhone = phone !== undefined ? phone : this.buyer.phone;
    const errors: string[] = [];

    if (!actualEmail.trim()) {
      errors.push("Введите email");
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(actualEmail)) {
        errors.push("Некорректный формат email");
      }
    }

    if (!actualPhone.trim()) {
      errors.push("Введите номер телефона");
    } else {
      const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
      if (!phoneRegex.test(actualPhone)) {
        errors.push("Некорректный формат телефона");
      }
    }

    return errors;
  }

  // Существующие методы оставляем для обратной совместимости
  validateOrderData(payment?: TPayment, address?: string): boolean {
    return this.validateOrderDataWithErrors(payment, address).length === 0;
  }

  validateContactsData(email?: string, phone?: string): boolean {
    return this.validateContactsDataWithErrors(email, phone).length === 0;
  }

  validateData(): boolean {
    return this.validateOrderData() && this.validateContactsData();
  }

  // Обновление данных заказа (вызывается при изменении полей)
  updateOrderData(payment: TPayment, address: string): void {
    const errors = this.validateOrderDataWithErrors(payment, address);
    if (errors.length > 0) {
      throw new Error(errors.join(", "));
    }

    this.buyer.payment = payment;
    this.buyer.address = address;
    this.events.emit("buyer:changed", this.buyer);
  }

  // Обновление контактных данных (вызывается при изменении полей)
  updateContactsData(email: string, phone: string): void {
    const errors = this.validateContactsDataWithErrors(email, phone);
    if (errors.length > 0) {
      throw new Error(errors.join(", "));
    }

    this.buyer.email = email;
    this.buyer.phone = phone;
    this.events.emit("buyer:changed", this.buyer);
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
  }
}
