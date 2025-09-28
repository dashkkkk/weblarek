import { ensureElement } from "../../utils/utils"; 
import { Component } from "../base/Component"; 
import { ICart } from "../../types"; 

export class CartView extends Component<ICart> { 
  protected list: HTMLElement; 
  protected totalElement: HTMLElement; 
  protected orderButtonElement: HTMLButtonElement; 

  constructor(container: HTMLElement, onSubmit?: () => void, onClear?: () => void) { 
    super(container);
    this.list = ensureElement<HTMLElement>(".basket__list", container); 
    this.totalElement = ensureElement<HTMLElement>(".basket__price", container); 
    this.orderButtonElement = ensureElement<HTMLButtonElement>( 
      ".basket__button", 
      container 
    ); 
    
    if (onSubmit) { 
      this.orderButtonElement.addEventListener("click", (e) => { 
        e.preventDefault(); 
        onSubmit(); 
      }); 
    } 
    
    if (onClear) { 
      const clearButton = container.querySelector<HTMLButtonElement>(".basket__clear"); 
      clearButton?.addEventListener("click", (e) => { 
        e.preventDefault(); 
        onClear(); 
      }); 
    } 
  } 

  setItems(items: HTMLElement[]): void { 
    this.list.replaceChildren(...items);
    this.orderButtonElement.disabled = items.length === 0;
  } 

  setTotal(total: number): void { 
    this.totalElement.textContent = `${total} синапсов`;
  } 
}