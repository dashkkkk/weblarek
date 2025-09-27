import { BasicCard } from "./BasicCard";
import { categoryMap } from "../../../utils/constants";
import { ensureElement } from "../../../utils/utils";

 
export class PreviewCard extends BasicCard {
  protected categoryElement: HTMLElement;
  protected descriptionElement: HTMLElement;
  protected imageElement: HTMLImageElement;
  protected actionButton: HTMLButtonElement;
  protected available: boolean = false;

  constructor(container: HTMLElement, onAction?: (id: string) => void) {
    super(container);

    this.categoryElement = ensureElement<HTMLElement>(
      ".card__category",
      this.container
    );
    this.descriptionElement = ensureElement<HTMLElement>(
      ".card__text",
      this.container
    );
    this.imageElement = ensureElement<HTMLImageElement>(
      ".card__image",
      this.container
    );
    this.actionButton = ensureElement<HTMLButtonElement>(
      ".card__button",
      this.container
    );

    if (onAction) {
      this.actionButton.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        onAction(this.container.id);
      });
    }
  }

  setImageSrc(src: string, alt?: string): void{
    if (this.imageElement) {
      super.setImage(this.imageElement, src, alt ?? "");
    }
  }

  setCategory(category: string): void{
    if (this.categoryElement) {
      this.categoryElement.textContent = category;
      this.categoryElement.className = "card__category";
      const modifier = categoryMap[category] ?? "other";
      this.categoryElement.classList.add(`card__category_${modifier}`);
    }
  }

  setDescription(value: string) {
    this.descriptionElement.textContent = value;
  }

  setInCart(value: boolean) {
    this.available = value;
    this.actionButton.textContent = value ? "Удалить из корзины" : "В корзину";
  }

  setZeroPrice(value: boolean) {
    this.actionButton.textContent = "Недоступно";
    this.actionButton.disabled = value;
  }
}
