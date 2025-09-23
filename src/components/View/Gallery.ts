import { Component } from "../base/Component";
import { IGallery } from "../../types";
import { ensureElement } from "../../utils/utils";

export class Gallery extends Component<IGallery> {
    protected list: HTMLElement;
    constructor(container: HTMLElement) {
        super(container);
        this.list = ensureElement<HTMLElement>(".gallery");
    }
    setItems(nodes: HTMLElement[]): void {
    this.list.replaceChildren(...nodes);
  }

    clear(): void {
    this.list.replaceChildren();
  }
}

