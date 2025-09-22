import { Component } from "../base/Component";
import { EventEmitter } from "../base/Events";
import { ensureElement } from "../../utils/utils";

export interface IFormState {
  valid: boolean;
  errors: string[];
}

export abstract class Form<T extends object> extends Component<IFormState> {
  protected events: EventEmitter;
  protected _submit: HTMLButtonElement;
  protected _errors: HTMLElement;

  constructor(templateId: string, events: EventEmitter) {
    // Создаем из шаблона вместо получения из DOM
    const template = document.querySelector(templateId) as HTMLTemplateElement;
    if (!template) throw new Error(`Template ${templateId} not found`);

    const container = template.content.cloneNode(true) as HTMLFormElement;
    super(container);

    this.events = events;
    this._submit = ensureElement<HTMLButtonElement>(
      'button[type="submit"]',
      this.container
    );
    this._errors = ensureElement<HTMLElement>(".form__errors", this.container);

    this.container.addEventListener("input", () => {
      this.validateForm();
    });

    this.container.addEventListener("submit", (e: Event) => {
      e.preventDefault();
      this.events.emit("form:submit", this.getFormData());
    });
  }

  protected abstract validateForm(): void;
  protected abstract getFormData(): T;

  protected setErrors(errors: string[]): void {
    if (this._errors) {
      this._errors.textContent = errors.join(", ");
    }
    if (this._submit) {
      this._submit.disabled = errors.length > 0;
    }
  }
}
