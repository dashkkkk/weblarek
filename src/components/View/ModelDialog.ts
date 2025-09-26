import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import { IModel } from "../../types";
import { IEvents } from "../base/Events";

export class ModelDialog extends Component<IModel> {
    protected contentElement: HTMLElement;
    protected closeButton: HTMLButtonElement;
    protected isOpen = false;

    constructor(container: HTMLElement, protected eventBroker: IEvents) {
        super(container);
        this.contentElement = ensureElement<HTMLElement>(".modal__content",
      this.container);
        this.closeButton = ensureElement<HTMLButtonElement>(
      ".modal__close",
      container
    );

    this.closeButton.addEventListener("click", () => {
      this.eventBroker.emit("modal:close");
    });

    this.container.addEventListener("click", (e) => {
        e.preventDefault();
      if (e.target === this.container) {
        this.eventBroker.emit("modal:close");
      }
    })

    }

    set content(value: HTMLElement | null) {
        if (value) {
            this.contentElement.replaceChildren(value);
        } else {
            this.contentElement.innerHTML = '';
        }
    }
     open(): void {
    this.container.classList.add("modal_active");
    this.isOpen = true;
    this.eventBroker.emit("modal:open");
  }

  close(): void {
    this.container.classList.remove("modal_active");
    this.isOpen = false;
  }
}
