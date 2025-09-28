import { ensureElement } from "../../../utils/utils"; 
import { IEvents } from "../../base/Events"; 
import { BasicForm } from "./BasicForm"; 

export class ContactDataForm extends BasicForm { 
  protected emailInput: HTMLInputElement; 
  protected phoneInput: HTMLInputElement; 
  private _validate: () => string; 

  constructor(
    container: HTMLElement, 
    protected eventBroker: IEvents,
    validate: () => string 
  ) { 
    super(container, eventBroker); 
    this._validate = validate;

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
      this.updateValidation(); 
    }); 

    this.phoneInput.addEventListener("input", (e: Event) => { 
      const target = e.target as HTMLInputElement; 
      this.eventBroker.emit("order:phone:changed", { phone: target.value });
      this.updateValidation(); 
    }); 

    const submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', this.container); 
    submitButton.addEventListener('click', (e) => { 
      e.preventDefault(); 
      this.eventBroker.emit('order:submit');
    }); 
  } 

  private updateValidation() {
    const errors = this._validate();
    this.setValid(!errors);
    this.setErrorsText(errors);
  }

  private setErrorsText(errorText: string) {
    const errorsElement = this.container.querySelector('.form__errors');
    if (errorsElement) {
      errorsElement.textContent = errorText;
    }
  }

  setEmail(value: string): void { 
    this.emailInput.value = value;
  } 

  setPhone(value: string): void { 
    this.phoneInput.value = value;
  } 
}