import { IApi } from "../../types";
import { IOrderRequest } from "../../types";
import { IProduct } from "../../types";
import { IApiResponse } from "../../types";
import { IOrderResult } from "../../types";

export class apiCommunication {
    private api: IApi;
    
    constructor(api: IApi) {
        this.api = api
    }

    async getItems(): Promise<IProduct[]> {
        try {
            const response = await this.api.get<IApiResponse<IProduct>>(`/product/`);
      return response.items || [];
        }
        catch (error) {
            console.error(`Ошибка при получении товаров от сервера: `, error);
            throw error
        }

    }

    async postItems(order: IOrderRequest): Promise<IOrderResult> {
        try {
            const response = await this.api.post<IOrderResult>(`/order/`, order);
            return response;
        } catch (error) {
            console.error('Ошибка при отправке заказа на сервер:', error);
            throw error;
        }
        }

    }

