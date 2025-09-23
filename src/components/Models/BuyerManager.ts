import { IBuyer, TPayment } from "../../types/index.ts";
import { EventEmitter } from "../base/Events.ts";

//Тест

export class BuyerManager {
  protected buyer: IBuyer = {
    payment: "card", // значение по-умолчанию!
    email: "",
    phone: "",
    address: "",
  };

  constructor(protected events: EventEmitter) {}

  // НОВЫЙ МЕТОД: частичная валидация только обязательных полей
  private validatePartialData(data: Partial<IBuyer>): boolean {
    // Проверяем только те поля, которые присутствуют в данных
    if (
      data.payment !== undefined &&
      data.payment !== "card" &&
      data.payment !== "cash"
    ) {
      return false;
    }
    if (data.address !== undefined && data.address.trim().length <= 5) {
      return false;
    }
    if (
      data.email !== undefined &&
      data.email !== "" &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)
    ) {
      return false;
    }
    if (
      data.phone !== undefined &&
      data.phone !== "" &&
      !/^\+?[\d\s\-\(\)]{10,}$/.test(data.phone)
    ) {
      return false;
    }
    return true;
  }

  private validateData(data: IBuyer): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;

    return (
      emailRegex.test(data.email) &&
      phoneRegex.test(data.phone) &&
      data.address.trim().length > 5 &&
      (data.payment === "card" || data.payment === "cash")
    );
  }

  validationData(): boolean {
    return this.validateData(this.buyer);
  }

  saveBuyerData(buyerData: Partial<IBuyer>): void {
    // Используем частичную валидацию для промежуточных данных
    if (!this.validatePartialData(buyerData)) {
      throw new Error("Данные покупателя некорректны");
    }

    // Обновляем только переданные поля
    this.buyer = { ...this.buyer, ...buyerData };
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
