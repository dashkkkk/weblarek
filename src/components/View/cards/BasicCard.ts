import { Component } from "../../base/Component";
import { ICard } from "../../../types";
import { ensureElement } from "../../../utils/utils";

export abstract class BasicCard extends Component<ICard> {
  protected title: HTMLElement;
  protected id!: string;
  protected price: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);

    this.title = ensureElement<HTMLElement>(".card__title", container);
    this.price = ensureElement<HTMLElement>(".card__price", container);
  }

  setId(id: string): void {
    this.id = id;
    this.container.dataset.id = id;
  }

  setTitle(title: string): void {
    this.title.textContent = title;
  }

  setPrice(price: number | null): void {
    this.price.textContent = price === null ? "Бесценно" : `${price} синапсов`;
  }
}
