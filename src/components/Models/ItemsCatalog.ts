import { IProduct } from "../../types/index.ts";
import { IEvents } from "../base/Events.ts";

export class ItemsCatalog {
  protected items: IProduct[];
  protected selectedItem: IProduct | null;

  constructor(private eventBroker: IEvents, items: IProduct[] = []) {
    this.items = items;
    this.selectedItem = null;
  }

  setItems(items: IProduct[]): void{
    this.items = items 
    this.eventBroker.emit("catalog:loaded");
  }

  getItems(): IProduct[] {
    return this.items
  }

  getItemByID(id: string): IProduct | undefined {
    return this.items.find((i) => i.id === id);
  }

  saveSelectedItem(selectedItem: IProduct): void {
    this.selectedItem = selectedItem;
  }

  getSelectedItem(): IProduct | null {
    return this.selectedItem;
  }
}
