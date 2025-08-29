import { IBuyer } from "../../types";

export class Buyer {
    protected payment: 'card' | 'cash' | ''
    protected address: string
    protected email: string
    protected phone: string

    constructor(dataBuyer: IBuyer) {
        this.payment = dataBuyer.payment
        this.address = dataBuyer.address
        this.email = dataBuyer.email
        this.phone = dataBuyer.phone  
    }
    
   saveData(dataBuyer: Partial<IBuyer>): void {
        if (dataBuyer.payment !== undefined) {
            this.payment = dataBuyer.payment;
        }
        if (dataBuyer.address !== undefined) {
            this.address = dataBuyer.address;
        }
        if (dataBuyer.email !== undefined) {
            this.email = dataBuyer.email;
        }
        if (dataBuyer.phone !== undefined) {
            this.phone = dataBuyer.phone;
        }
    }

    getData(): IBuyer {
        return {
            payment: this.payment,
            address: this.address,
            email: this.email,
            phone: this.phone
        }
    }

    clearData(): void {
        this.payment = '';
        this.address = '';
        this.email = '';
        this.phone = '';
    }

    validateData(): boolean {
        return this.validatePayment() && 
               this.validateAddress() && 
               this.validateEmail() && 
               this.validatePhone();
    }

    validatePayment(): boolean {
        return this.payment === 'card' || this.payment === 'cash';
    }

    validateAddress(): boolean {
        return this.address.trim().length > 0;
    }

    validateEmail(): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(this.email);
    }

    validatePhone(): boolean {
        const phoneRegex = /^(\+7|8)[\s\-]?\(?\d{3}\)?[\s\-]?\d{3}[\s\-]?\d{2}[\s\-]?\d{2}$/;
        return phoneRegex.test(this.phone);
    }

}