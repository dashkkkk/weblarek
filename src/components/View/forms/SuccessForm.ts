import { ensureElement } from "../../../utils/utils";
import { Component } from "../../base/Component";
import { IEvents } from "../../base/Events";


export class SuccessOrderForm extends Component<void> {
  protected totalElement: HTMLElement;
  protected submitButton: HTMLButtonElement;

  constructor(container: HTMLElement, private eventBroker: IEvents) {
    super(container);

    this.totalElement = ensureElement<HTMLElement>(
      ".order-success__description",
      this.container
    );
    this.submitButton = ensureElement<HTMLButtonElement>(
      ".order-success__close",
      this.container
    );

    this.submitButton.addEventListener("click", (e) => {
      e.preventDefault();
      this.eventBroker.emit("order:new");
    });
  }

  set total(value: number) {
    this.totalElement.textContent = `Списано ${value} синапсисов`;
  }
}