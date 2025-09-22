import { Component } from "../base/Component";
import { EventEmitter } from "../base/Events";

export interface IGalleryData {
  catalog: HTMLElement[];
}

export class Gallery extends Component<IGalleryData> {
  protected events: EventEmitter;

  constructor(container: HTMLElement, events: EventEmitter) {
    super(container);
    this.events = events;
  }

  get itemsCount(): number {
    return this.container.children.length;
  }

  set catalog(items: HTMLElement[]) {
    this.container.replaceChildren(...items);
  }
}
