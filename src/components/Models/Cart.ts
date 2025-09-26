import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class Cart {
  protected selectedItems: IProduct[];

  constructor(private eventBroker: IEvents, selectedItems: IProduct[] = []) {
    this.selectedItems = selectedItems;
  }

  getItemsCart(): IProduct[] {
    return this.selectedItems;
  }

  addItemCart(item: IProduct): void {
    this.selectedItems.push(item);
    this.eventBroker.emit("cart:changed");
  }

  removeItemCart(id: string): void {
    this.selectedItems = this.selectedItems.filter((item) => item.id !== id);
    this.eventBroker.emit("cart:changed");
  }

  clearCart(): void {
    this.selectedItems = [];
    this.eventBroker.emit("cart:changed");
  }

  getTotalPrice(): number {
    if (!this.selectedItems.length) return 0;

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
