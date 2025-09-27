import './scss/styles.scss';

import { Api } from './components/base/Api';
import { API_URL, CDN_URL } from './utils/constants';
import { apiCommunication } from './components/Communication/apiCommunication';

import { EventEmitter } from './components/base/Events';
import { cloneTemplate, ensureElement } from './utils/utils';
import { ItemsCatalog } from './components/Models/ItemsCatalog';
import { Cart } from './components/Models/Cart';
import { Buyer } from './components/Models/Buyer';
import { Header } from './components/View/Header';
import { Gallery } from './components/View/Gallery';
import { ModelDialog } from './components/View/ModelDialog';
import { GalleryCard } from './components/View/cards/GalleryCard';
import { PreviewCard } from './components/View/cards/PreviewCard';
import { CartPreviewCard } from './components/View/cards/CartCard';
import { CartView } from './components/View/CartView';
import { OrderDataForm } from './components/View/forms/PersonalDataForm';
import { ContactDataForm } from './components/View/forms/AddressForm';
import { SuccessOrderForm } from './components/View/forms/SuccessForm';
import { IProduct } from './types';

const api = new Api(API_URL);
const apiClient = new apiCommunication(api);
const events = new EventEmitter();

const productsModel = new ItemsCatalog(events);
const cartModel = new Cart(events);
const buyerModel = new Buyer(events);

const headerEl = ensureElement<HTMLElement>('.header');
const galleryEl = ensureElement<HTMLElement>('.gallery');
const modalContainer = ensureElement<HTMLElement>('#modal-container');

const tplCatalog = ensureElement<HTMLTemplateElement>('#card-catalog');
const tplPreview = ensureElement<HTMLTemplateElement>('#card-preview');
const tplBasket = ensureElement<HTMLTemplateElement>('#basket');
const tplBasketItem = ensureElement<HTMLTemplateElement>('#card-basket');
const tplOrder = ensureElement<HTMLTemplateElement>('#order');
const tplContacts = ensureElement<HTMLTemplateElement>('#contacts');
const tplSuccess = ensureElement<HTMLTemplateElement>('#success');

const headerView = new Header(headerEl, events);
const galleryView = new Gallery(galleryEl);
const modalView = new ModelDialog(modalContainer, events);


apiClient.getItems()
  .then(items => {
    const itemsWithImages = items.map(item => ({
      ...item,
      image: item.image ? CDN_URL + item.image : ''
    }));
    productsModel.setItems(itemsWithImages);
  })
  .catch(err => {
    console.error('Не удалось загрузить каталог:', err);
  });



events.on('catalog:loaded', () => {
  const items = productsModel.getItems();
  const cards = items.map(item => {
    const card = new GalleryCard(
      tplCatalog.content.cloneNode(true) as HTMLElement,
      () => {
        const selectedItem = productsModel.getItemByID(item.id);
        if (selectedItem) {
          productsModel.saveSelectedItem(selectedItem);
          events.emit('preview:open', { item: selectedItem });
        }
      }
    );
    card.setTitle(item.title);
    card.setPrice(item.price);
    card.setCategory(item.category);
    card.setImageSrc(item.image, item.title);
    const element = card.render();
    element.id = item.id;
    return element;
  });
  galleryView.setItems(cards);
});

events.on<{ id: string }>("view:product:selected", ({ id }) => {
  const p = productsModel.getItemByID(id);
  if (!p) return;
  const node = cloneTemplate<HTMLElement>(tplPreview);
  const preview = new PreviewCard(node, () => {

    const already = cartModel.wheterItem(id);
    if (already) {
      cartModel.removeItemCart(id);
    } else {
      const productToAdd = productsModel.getItemByID(id);
      if (productToAdd && productToAdd.price !== null) {
        cartModel.addItemCart(productToAdd);
      }
    }

    preview["setInCart"](cartModel.wheterItem(id));
  });
  preview["setId"](p.id);
  preview["setTitle"](p.title);
  preview["setCategory"](p.category);
  preview["setImageSrc"](`${CDN_URL}${p.image}`, p.title);
  preview["setPrice"](p.price);
  preview["setInCart"](cartModel.wheterItem(p.id));
  preview["setZeroPrice"](p.price === null);
  preview["setDescription"](p.description);
  modalView.open(preview.render());
});

events.on('cart:changed', () => {
  headerView.counter = cartModel.getItemsAmount();
});

events.on('basket:open', () => {
  const items = cartModel.getItemsCart();
  const total = cartModel.getTotalPrice();

  const cartCards = items.map((item, index) => {
    const card = new CartPreviewCard(
      tplBasketItem.content.cloneNode(true) as HTMLElement,
      (id: string) => {
        cartModel.removeItemCart(id);
      }
    );
    card.setTitle(item.title);
    card.setPrice(item.price);
    card.index = index + 1;
    const element = card.render();
    element.id = item.id;
    return element;
  });

  const cartView = new CartView(
    tplBasket.content.cloneNode(true) as HTMLElement,
    () => {
      modalView.close();
      events.emit('order:start');
    },
    () => {
      cartModel.clearCart();
    }
  );
  cartView.setItems(cartCards);
  cartView.setTotal(total);

  modalView.content = cartView.render();
  modalView.open();
});

events.on('preview:open', ({ item }: { item: IProduct }) => {
  const inCart = cartModel.wheterItem(item.id);
  const isZeroPrice = item.price === null || item.price <= 0;

  const previewCard = new PreviewCard(
    tplPreview.content.cloneNode(true) as HTMLElement,
    (id: string) => {
      if (isZeroPrice) return;
      const product = productsModel.getItemByID(id);
      if (!product) return;
      if (inCart) {
        cartModel.removeItemCart(id);
      } else {
        cartModel.addItemCart(product);
      }
    }
  );

  previewCard.setTitle(item.title);
  previewCard.setPrice(item.price);
  previewCard.setCategory(item.category);
  previewCard.setDescription(item.description);
  previewCard.setImageSrc(item.image, item.title);
  previewCard.setInCart(true);
  if (isZeroPrice) {
    previewCard.setZeroPrice(true);
  }

  const element = previewCard.render();
  element.id = item.id;
  modalView.content = element;
  modalView.open();
});



events.on('order:start', () => {
  const orderForm = new OrderDataForm(tplOrder.content.cloneNode(true) as HTMLElement, events);
  const buyerData = buyerModel.getData();
  orderForm.setPayment(buyerData.payment);
  orderForm.address = buyerData.address;
  modalView.content = orderForm.render();
  modalView.open();
});

events.on('order:address:changed', ({ address }) => buyerModel.saveData({ address }));
events.on('order:payment:changed', ({ payment }) => buyerModel.saveData({ payment }));

events.on('cart:fill-contacts', () => {
  if (!buyerModel.validatePayment() || !buyerModel.validateAddress()) return;
  const contactsForm = new ContactDataForm(tplContacts.content.cloneNode(true) as HTMLElement, events);
  const buyerData = buyerModel.getData();
  contactsForm.setEmail(buyerData.email);
  contactsForm.setPhone(buyerData.phone);
  modalView.content = contactsForm.render();
  modalView.open();
});

events.on('order:email:changed', ({ email }) => buyerModel.saveData({ email }));
events.on('order:phone:changed', ({ phone }) => buyerModel.saveData({ phone }));

events.on('order:submit', () => {
  if (!buyerModel.validateData()) return;
  const orderData = {
    ...buyerModel.getData(),
    items: cartModel.getItemsCart().map(i => i.id),
    total: cartModel.getTotalPrice()
  };
  apiClient.postItems(orderData)
    .then(result => {
      const successForm = new SuccessOrderForm(tplSuccess.content.cloneNode(true) as HTMLElement, events);
      successForm.total = result.total;
      modalView.content = successForm.render();
      modalView.open();
      cartModel.clearCart();
      buyerModel.clearData();
    })
    .catch(err => console.error('Ошибка заказа:', err));
});

events.on('order:new', () => modalView.close());