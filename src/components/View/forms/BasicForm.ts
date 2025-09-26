import { ensureElement } from "../../../utils/utils";
import { Component } from "../../base/Component";
import { IEvents } from "../../base/Events";



export class BasicForm extends Component<void> {
  protected errorsElement: HTMLElement;
  protected submitElement: HTMLButtonElement;

  constructor(container: HTMLElement, protected eventBroker: IEvents) {
    super(container);

    this.errorsElement = ensureElement<HTMLElement>(".form__errors", container);
    this.submitElement = ensureElement<HTMLButtonElement>(
      'button[type="submit"]',
      container
    );

    this.container.addEventListener("input", () => {
      eventBroker.emit("order:form:changed");
    });
  }

  setErrors(value: string): void {
    this.errorsElement.textContent = value;
  }

  setValid(value: boolean): void {
    this.submitElement.disabled = !value;
  }
}