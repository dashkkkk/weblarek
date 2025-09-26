
import { ensureElement} from "../../../utils/utils";
import { BasicCard } from "./BasicCard";
import { categoryMap } from "../../../utils/constants";


export class GalleryCard extends BasicCard {
  protected categoryElement: HTMLElement;
  protected imageElement: HTMLImageElement;

  constructor(container: HTMLElement, onSelect?: (id: string) => void) {
    super(container);

    this.categoryElement = ensureElement<HTMLElement>(
      ".card__category",
      this.container
    );
    this.imageElement = ensureElement<HTMLImageElement>(
      ".card__image",
      this.container
    );
    if (onSelect) {
      this.container.addEventListener("click", (e) => {
        e.preventDefault();
        onSelect(this.container.id);
      });
    }
  }

  setImageSrc(src: string, alt?: string): void {
    if (this.imageElement) {
      super.setImage(this.imageElement, src, alt ?? "");
    }
  }
  setCategory(category: string): void {
    if (this.categoryElement) {
      this.categoryElement.textContent = category;
      this.categoryElement.className = "card__category";
      const modifier = categoryMap[category] ?? "other";
      this.categoryElement.classList.add(`card__category_${modifier}`);
    }
  }

}