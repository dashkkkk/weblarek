import './scss/styles.scss';

import { apiProducts } from './utils/data';
import { ItemsCatalog } from './components/Models/ItemsCatalog';

const productsModel = new ItemsCatalog();
productsModel.setItems(apiProducts.items);

console.log(`Массив товаров из каталога: `, productsModel.getItems())
const firstItem = productsModel.getItems()[0]
console.log(`Товар по id  :`, productsModel.getItemByID(firstItem.id))
productsModel.saveSelectedItem(firstItem)
console.log(`Выбранный товар:`, productsModel.getSelectedItem())


import { Cart } from './components/Models/Cart';

const cartModel = new Cart();
cartModel.addItemCart(apiProducts.items[0])
cartModel.addItemCart(apiProducts.items[1])
cartModel.addItemCart(apiProducts.items[2])

console.log(`Список товаров из корзины: `, cartModel.getItemsCart())
cartModel.removeItemCart(cartModel.getItemsCart()[0].id)
console.log(`Список товаров после удаления: `, cartModel.getItemsCart())

console.log(`Получение итоговой стоимости: `, cartModel.getTotalPrice())
console.log(`Gолучение количества товаров: `, cartModel.getItemsAmount())
console.log(`Присутсвует ли в козине первый товар? `, cartModel.wheterItem(cartModel.getItemsCart()[0].id))
console.log(`Очищение корзины: `, cartModel.clearCart())


import { Buyer } from './components/Models/Buyer';


const firstClient = {
      payment: 'card' as const,
      address: 'спб, ул. Варфоломеевская 16',
      email: 'dvliakh@edu.hse.ru',
      phone: '89605223703'  
}
const buyerModel = new Buyer(firstClient)
buyerModel.saveData(firstClient)


console.log(`Получение данных о пользователе: `, buyerModel.getData())
console.log(`Проверка данных: `, buyerModel.validateData())
console.log(`Проверка данных платежа: `, buyerModel.validateData())
console.log(`Проверка данных адресса : `, buyerModel.validateAddress())
console.log(`Проверка данных email : `, buyerModel.validateEmail())
console.log(`Проверка данных номера телефона: `, buyerModel.validatePhone())

buyerModel.clearData()
console.log(`Данные после удаления: `, buyerModel.getData())
 

import { apiCommunication } from './components/Communication/apiCommunication';
import { Api } from './components/base/Api';
import { API_URL } from './utils/constants';

const api =  new Api(API_URL)
const apiCommunicationModel = new apiCommunication(api)

try {
      const dataServer = apiCommunicationModel.getItems()
        .then(itemsList => {
            productsModel.setItems(itemsList)
            console.log(`Товары с сервера: `, productsModel.getItems())
        })
      }
 catch (error) {
      console.error(`Ошибка при получении данных с сервера: `, error)
 }

