import { IProduct } from "../../types";

export class Cart {
  protected selectedItems: IProduct[];

  constructor(selectedItems: IProduct[] = []) {
    this.selectedItems = selectedItems;
  }

  getItemsCart(): IProduct[] {
    return this.selectedItems;
  }

  addItemCart(item: IProduct): void {
    this.selectedItems.push(item);
  }

  removeItemCart(id: string): void {
    this.selectedItems = this.selectedItems.filter((item) => item.id !== id);
  }

  clearCart(): void {
    this.selectedItems = [];
  }

  getTotalPrice(): number {
    if (!this.selectedItems) return 0;

    return this.selectedItems.reduce((total, item) => {
      return total + (item.price ?? 0);
    }, 0);
  }

  getItemsAmount(): number {
    return this.selectedItems.length;
  }

  wheterItem(id: string): boolean {
    return this.selectedItems.some((item) => item.id === id);
  }
}
