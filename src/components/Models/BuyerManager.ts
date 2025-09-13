import { IBuyer, TPayment } from "../../types/index.ts";

//Тест

export class BuyerManagerTest {
  protected buyer: IBuyer = {
    payment: "card", // значение по-умолчанию!
    email: "",
    phone: "",
    address: "",
  };

  private validateData(data: IBuyer): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const phoneRegex = /^\+?[0-9]{10,15}$/;

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

  saveBuyerData(buyerData: IBuyer): void {
    if (!this.validateData(buyerData)) {
      throw new Error("Данные покупателя некорректны");
    }
    this.buyer = { ...this.buyer, ...buyerData };
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
  }
}
