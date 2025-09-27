import { ensureAllElements, ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";
import { BasicForm } from "./BasicForm";

export class OrderDataForm extends BasicForm {
  protected paymentButton: HTMLButtonElement[];
  protected addressElement: HTMLInputElement;
  protected nextButton: HTMLButtonElement;

  constructor(container: HTMLElement, protected eventBroker: IEvents) {
    super(container, eventBroker);

    this.paymentButton = ensureAllElements<HTMLButtonElement>(
      ".order__buttons .button",
      this.container
    );
    this.addressElement = ensureElement<HTMLInputElement>(
      ".order__field input",
      this.container
    );
    this.nextButton = ensureElement<HTMLButtonElement>(
      ".order__button",
      this.container
    );


    this.paymentButton.forEach((btn) => {
      btn.addEventListener("click", (e) => {
  
        e.preventDefault();
        this.paymentButton.forEach((b) => {
          b.classList.add("button_alt");
          b.classList.remove("button_alt-active");
        });
        btn.classList.remove("button_alt");
        btn.classList.add("button_alt-active");
        this.eventBroker.emit("order:payment:changed", { payment: btn.name as 'card' | 'cash' });
        this.validate(); 
      });
    });

   
    this.addressElement.addEventListener("input", (e: Event) => {
      const target = e.target as HTMLInputElement;
      this.eventBroker.emit("order:address:changed", { address: target.value });
      this.validate(); 
    });


this.nextButton.addEventListener('click', (e) => {
  e.preventDefault();
  if (this.validate()) {
    this.eventBroker.emit('cart:fill-contacts');
  }
});
  

  }


  validate() {
    const paymentValid = this.paymentButton.some(btn => btn.classList.contains('button_alt-active'));
    const addressValid = this.addressElement.value.trim().length > 0;

    const isValid = paymentValid && addressValid;
    this.setValid(isValid); 
    return isValid;
  }

  setPayment(value: "cash" | "card" | ""): void {
    this.paymentButton.forEach((b) => {
      const isActive = value && b.name === value;
      b.classList.toggle("button_alt", !isActive);
      b.classList.toggle("button_alt-active", !!isActive);
    });

    this.validate(); 
  }

  set address(value: string) {
    this.addressElement.value = value ?? "";
    this.validate(); 
  }
}