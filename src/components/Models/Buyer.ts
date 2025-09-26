import { IBuyer } from "../../types";
import { IEvents } from "../base/Events";

export class Buyer {
  protected payment: "card" | "cash" | "";
  protected address: string;
  protected email: string;
  protected phone: string;

  constructor(
    private eventBroker: IEvents,
    payment: "cash" | "card" | "" = "",
    address: string = "",
    email: string = "",
    phone: string = ""
  ) {
    this.payment = payment;
    this.address = address;
    this.email = email;
    this.phone = phone;
  }

  saveData(dataBuyer: Partial<IBuyer>): void {
    if (dataBuyer.payment !== undefined) {
      this.payment = dataBuyer.payment;
      this.eventBroker.emit("user:changed");
    }
    if (dataBuyer.address !== undefined) {
      this.address = dataBuyer.address;
      this.eventBroker.emit("user:changed");
    }
    if (dataBuyer.email !== undefined) {
      this.email = dataBuyer.email;
      this.eventBroker.emit("user:changed");
    }
    if (dataBuyer.phone !== undefined) {
      this.phone = dataBuyer.phone;
      this.eventBroker.emit("user:changed");
    }
  }

  getData(): IBuyer {
    return {
      payment: this.payment,
      address: this.address,
      email: this.email,
      phone: this.phone,
    };
  }

  clearData(): void {
    this.payment = "";
    this.address = "";
    this.email = "";
    this.phone = "";
    this.eventBroker.emit("user:changed");
  }

  validateData(): boolean {
    return (
      this.validatePayment() &&
      this.validateAddress() &&
      this.validateEmail() &&
      this.validatePhone()
    );
  }

  validatePayment(): boolean {
    return this.payment === "card" || this.payment === "cash";
  }

  validateAddress(): boolean {
    return this.address.trim().length > 0;
  }

  validateEmail(): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(this.email);
  }

  validatePhone(): boolean {
    const phoneRegex =
      /^(\+7|8)[\s\-]?\(?\d{3}\)?[\s\-]?\d{3}[\s\-]?\d{2}[\s\-]?\d{2}$/;
    return phoneRegex.test(this.phone);
  }
}
