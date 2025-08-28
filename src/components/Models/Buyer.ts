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
    
    saveData(dataBuyer: IBuyer): void {
        this.payment = dataBuyer.payment
        this.address = dataBuyer.address
        this.email = dataBuyer.email
        this.phone = dataBuyer.phone  
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
       
        if(this.payment !== 'card' && this.payment !== 'cash') {
            return false
        }
        if (!this.address) {
            return false
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if(!emailRegex.test(this.email) || this.email.length == 0) {
            return false
        }

        const cleanPhone = this.phone.replace(/[-\s()]/g, '');
        if (!/^(\+7|8)[0-9]{10}$/.test(cleanPhone)) {
            return false
        }
        return true
    }

}