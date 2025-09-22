import { Component } from "../base/Component";
import { IProduct } from "../../types";
import { CDN_URL } from "../../utils/constants";

export abstract class Card extends Component<IProduct> {
  protected templateId: string;

  constructor(container: HTMLElement, templateId: string) {
    super(container);
    this.templateId = templateId;
  }

  protected createTemplate(): HTMLElement {
    const template = document.querySelector(
      this.templateId
    ) as HTMLTemplateElement;
    if (!template) {
      throw new Error(`Template ${this.templateId} not found`);
    }
    return template.content.cloneNode(true) as HTMLElement;
  }

  protected setText(selector: string, text: string, parent: HTMLElement): void {
    const element = parent.querySelector(selector) as HTMLElement;
    if (element) {
      element.textContent = text;
    }
  }

  protected setImageSrc(
    selector: string,
    src: string,
    parent: HTMLElement
  ): void {
    const element = parent.querySelector(selector) as HTMLImageElement;
    if (element) {
      element.src = `${CDN_URL}${src}`;
    }
  }

  protected setPrice(
    selector: string,
    price: number | null,
    parent: HTMLElement
  ): void {
    const priceText = price ? `${price} синапсов` : "Бесценно";
    this.setText(selector, priceText, parent);
  }

  abstract render(data: IProduct): HTMLElement;
}
