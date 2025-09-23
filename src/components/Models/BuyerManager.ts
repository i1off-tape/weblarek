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

  // Валидация полей заказа (адрес и оплата)
  validateOrderData(payment?: TPayment, address?: string): boolean {
    const actualPayment = payment || this.buyer.payment;
    const actualAddress = address !== undefined ? address : this.buyer.address;

    if (actualPayment !== "card" && actualPayment !== "cash") {
      return false;
    }
    if (actualAddress.trim().length <= 5) {
      return false;
    }
    return true;
  }

  // Валидация контактных данных
  validateContactsData(email?: string, phone?: string): boolean {
    const actualEmail = email !== undefined ? email : this.buyer.email;
    const actualPhone = phone !== undefined ? phone : this.buyer.phone;

    if (actualEmail !== "") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(actualEmail)) return false;
    }

    if (actualPhone !== "") {
      const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
      if (!phoneRegex.test(actualPhone)) return false;
    }
    return true;
  }

  // Полная валидация всех данных
  validateData(): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;

    return (
      emailRegex.test(this.buyer.email) &&
      phoneRegex.test(this.buyer.phone) &&
      this.buyer.address.trim().length > 5 &&
      (this.buyer.payment === "card" || this.buyer.payment === "cash")
    );
  }

  // Обновление данных заказа (вызывается при изменении полей)
  updateOrderData(payment: TPayment, address: string): void {
    if (!this.validateOrderData(payment, address)) {
      throw new Error("Данные заказа некорректны");
    }

    this.buyer.payment = payment;
    this.buyer.address = address;
    this.events.emit("buyer:changed", this.buyer);
  }

  // Обновление контактных данных (вызывается при изменении полей)
  updateContactsData(email: string, phone: string): void {
    if (!this.validateContactsData(email, phone)) {
      throw new Error("Контактные данные некорректны");
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
