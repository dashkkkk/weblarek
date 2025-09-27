
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
      this.validate();
    });

    this.phoneInput.addEventListener("input", (e: Event) => {
      const target = e.target as HTMLInputElement;
      this.eventBroker.emit("order:phone:changed", { phone: target.value });
      this.validate(); 
    });

    const submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', this.container);
submitButton.addEventListener('click', (e) => {
  console.log('Клик по кнопке Оплатить');
  e.preventDefault();
  if (this.validate()) {
    this.eventBroker.emit('order:submit');
  }
});
  }

  
  validate(): boolean {
    const email = this.emailInput.value.trim();
    const phone = this.phoneInput.value.trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^(\+7|8)[\s\-]?\(?\d{3}\)?[\s\-]?\d{3}[\s\-]?\d{2}[\s\-]?\d{2}$/;

    const isEmailValid = emailRegex.test(email);
    const isPhoneValid = phoneRegex.test(phone);

    const isValid = isEmailValid && isPhoneValid;
    this.setValid(isValid); 
    return isValid;
  }

  setEmail(value: string): void {
    this.emailInput.value = value;
    this.validate(); 
  }

  setPhone(value: string): void {
    this.phoneInput.value = value;
    this.validate(); 
  }
}