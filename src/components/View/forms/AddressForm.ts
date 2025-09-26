import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";
import { BasicForm } from "./BasicForm";

export class ContactDataForm extends BasicForm {
  protected emailInput: HTMLInputElement;
  protected phoneInput: HTMLInputElement;
  constructor(container: HTMLElement, protected eventBroker: IEvents) {
    super(container, eventBroker);

    this.emailInput = ensureElement<HTMLInputElement>(
      'input[name="email"]',
      this.container
    );
    this.phoneInput = ensureElement<HTMLInputElement>(
      'input[name="phone"]',
      this.container
    );

    this.emailInput.addEventListener("input", (e: Event) => {
      const target = e.target as HTMLInputElement;
      this.eventBroker.emit("order:email:changed", { email: target.value });
    });

    this.phoneInput.addEventListener("input", (e: Event) => {
      const target = e.target as HTMLInputElement;
      this.eventBroker.emit("order:phone:changed", { phone: target.value });
    });

    this.container.addEventListener("submit", (e) => {
      e.preventDefault();
      this.eventBroker.emit("order:submit");
    });
  }

  setEmail(value: string): void {
    this.emailInput.value = value;
  }

  setPhone(value: string): void {
    this.phoneInput.value = value;
  }
}