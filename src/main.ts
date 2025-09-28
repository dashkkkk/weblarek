import "./scss/styles.scss";

import { Api } from "./components/base/Api";
import { API_URL, CDN_URL } from "./utils/constants";
import { apiCommunication } from "./components/Communication/apiCommunication";

import { EventEmitter } from "./components/base/Events";
import { ensureElement } from "./utils/utils";


import { ItemsCatalog } from "./components/Models/ItemsCatalog";
import { Cart } from "./components/Models/Cart";
import { Buyer } from "./components/Models/Buyer";

import { Header } from "./components/View/Header";
import { Gallery } from "./components/View/Gallery";
import { ModelDialog } from "./components/View/ModelDialog";
import { GalleryCard } from "./components/View/cards/GalleryCard";
import { PreviewCard } from "./components/View/cards/PreviewCard";
import { CartPreviewCard } from "./components/View/cards/CartCard";
import { CartView } from "./components/View/CartView";
import { OrderDataForm } from "./components/View/forms/PersonalDataForm";
import { ContactDataForm } from "./components/View/forms/AddressForm";
import { SuccessOrderForm } from "./components/View/forms/SuccessForm";


import { IProduct } from "./types";

const api = new Api(API_URL);
const apiClient = new apiCommunication(api);
const events = new EventEmitter();

const productsModel = new ItemsCatalog(events);
const cartModel = new Cart(events);
const buyerModel = new Buyer(events);

const headerEl = ensureElement<HTMLElement>(".header");
const galleryEl = ensureElement<HTMLElement>(".gallery");
const modalContainer = ensureElement<HTMLElement>("#modal-container");

const tplCatalog = ensureElement<HTMLTemplateElement>("#card-catalog");
const tplPreview = ensureElement<HTMLTemplateElement>("#card-preview");
const tplBasket = ensureElement<HTMLTemplateElement>("#basket");
const tplBasketItem = ensureElement<HTMLTemplateElement>("#card-basket");
const tplOrder = ensureElement<HTMLTemplateElement>("#order");
const tplContacts = ensureElement<HTMLTemplateElement>("#contacts");
const tplSuccess = ensureElement<HTMLTemplateElement>("#success");

const headerView = new Header(headerEl, events);
const galleryView = new Gallery(galleryEl);
const modalView = new ModelDialog(modalContainer, events);

apiClient
  .getItems()
  .then((items) => {
    const itemsWithImages = items.map((item) => ({
      ...item,
      image: item.image ? CDN_URL + item.image : "",
    }));
    productsModel.setItems(itemsWithImages);
  })
  .catch((err) => {
    console.error("Не удалось загрузить каталог:", err);
  });

events.on("catalog:loaded", () => {
  const items = productsModel.getItems();
  const cards = items.map((item) => {
    const cardElement = (tplCatalog.content.cloneNode(true) as DocumentFragment)
      .firstElementChild as HTMLElement;

    const card = new GalleryCard(cardElement, item.id, (id: string) => {
      const selectedItem = productsModel.getItemByID(id);
      if (selectedItem) {
        productsModel.saveSelectedItem(selectedItem);
        events.emit("preview:open", { item: selectedItem });
      }
    });

    card.setTitle(item.title);
    card.setPrice(item.price);
    card.setCategory(item.category);
    card.setImageSrc(item.image, item.title);

    return card.render();
  });

  galleryView.setItems(cards);
});

events.on("cart:changed", () => {
  headerView.counter = cartModel.getItemsAmount();
});

events.on("basket:open", () => {
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
      events.emit("order:start");
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

events.on("preview:open", ({ item }: { item: IProduct }) => {
  const isZeroPrice = item.price === null || item.price <= 0;

  const previewCard = new PreviewCard(
    tplPreview.content.cloneNode(true) as HTMLElement,
    (id: string, button: HTMLButtonElement) => {
      if (isZeroPrice) return;
      const product = productsModel.getItemByID(id);
      if (!product) return;

      const currentlyInCart = cartModel.wheterItem(id);
      if (currentlyInCart) {
        cartModel.removeItemCart(id);

        button.textContent = "В корзину";
      } else {
        cartModel.addItemCart(product);

        button.textContent = "Удалить из корзины";
      }
    }
  );

  previewCard.setTitle(item.title);
  previewCard.setPrice(item.price);
  previewCard.setCategory(item.category);
  previewCard.setDescription(item.description || "");
  previewCard.setImageSrc(item.image, item.title);

  const inCart = cartModel.wheterItem(item.id);
  previewCard.setInCart(inCart);

  if (isZeroPrice) {
    previewCard.setZeroPrice(true);
  }

  const element = previewCard.render();
  element.id = item.id;
  modalView.content = element;
  modalView.open();
});

events.on("order:start", () => {
  const orderForm = new OrderDataForm(
    tplOrder.content.cloneNode(true) as HTMLElement,
    events
  );
  const buyerData = buyerModel.getData();

  orderForm.setPayment(buyerData.payment);
  orderForm.address = buyerData.address;
  modalView.content = orderForm.render();
  modalView.open();
});

events.on("order:address:changed", ({ address }: { address: string }) => {
  buyerModel.saveData({ address });
});
events.on(
  "order:payment:changed",
  ({ payment }: { payment: "card" | "cash" }) => {
    buyerModel.saveData({ payment });
  }
);


events.on("order:email:changed", ({ email }: { email: string }) => {
  buyerModel.saveData({ email });
});
events.on("order:phone:changed", ({ phone }: { phone: string }) => {
  buyerModel.saveData({ phone });
});


events.on("order:submit", () => {

  const validationErrors = buyerModel.getValidationErrors();
  
  if (validationErrors) {

    if (currentContactForm) {
      currentContactForm.setErrors(validationErrors);
    }
    return;
  }

  const orderData = {
    ...buyerModel.getData(),
    items: cartModel.getItemsCart().map((i) => i.id),
    total: cartModel.getTotalPrice(),
  };

  apiClient
    .postItems(orderData)
    .then((result) => {
      const successForm = new SuccessOrderForm(
        tplSuccess.content.cloneNode(true) as HTMLElement,
        events
      );
      successForm.total = result.total;
      modalView.content = successForm.render();
      modalView.open();

      cartModel.clearCart();
      buyerModel.clearData();
    })
    .catch((err) => {
      console.error("Ошибка при оформлении заказа:", err);
    });
});


let currentContactForm: ContactDataForm | null = null;

events.on("cart:fill-contacts", () => {

  const validate = (): string => {
    return buyerModel.getValidationErrors();
  };

  const contactsForm = new ContactDataForm(
    tplContacts.content.cloneNode(true) as HTMLElement,
    events,
    validate 
  );
  
  const buyerData = buyerModel.getData();
  contactsForm.setEmail(buyerData.email);
  contactsForm.setPhone(buyerData.phone);
  modalView.content = contactsForm.render();
  modalView.open();
});

events.on("order:submit", () => {
  const validationErrors = buyerModel.getValidationErrors();
  
  if (validationErrors) {

    return;
  }

  const orderData = {
    ...buyerModel.getData(),
    items: cartModel.getItemsCart().map((i) => i.id),
    total: cartModel.getTotalPrice(),
  };

  apiClient
    .postItems(orderData)
    .then((result) => {
      const successForm = new SuccessOrderForm(
        tplSuccess.content.cloneNode(true) as HTMLElement,
        events
      );
      successForm.total = result.total;
      modalView.content = successForm.render();
      modalView.open();

      cartModel.clearCart();
      buyerModel.clearData();
    })
    .catch((err) => {
      console.error("Ошибка при оформлении заказа:", err);
    });
});

events.on("modal:close", () => {
  modalView.close();
  currentContactForm = null;
});


events.on("order:new", () => {
  modalView.close();
});

events.on("modal:close", () => {
  modalView.close();
});
