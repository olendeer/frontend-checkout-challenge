import { Endpoint } from 'core/http';

export const API = {
  cart: Object.assign(new Endpoint('/api/cart'), {
    item: new Endpoint<'productId'>('/api/cart/items/{productId}'),
  }),
  checkoutOptions: new Endpoint('/api/checkout/options'),
  orders: Object.assign(new Endpoint('/api/orders'), {
    byId: new Endpoint<'orderId'>('/api/orders/{orderId}'),
    payments: new Endpoint<'orderId'>('/api/orders/{orderId}/payments'),
  }),
  payments: Object.assign(new Endpoint('/api/payments'), {
    byId: new Endpoint<'paymentId'>('/api/payments/{paymentId}'),
    simulations: new Endpoint<'paymentId'>('/api/payments/{paymentId}/simulations'),
  }),
  products: new Endpoint('/api/products'),
  quotes: Object.assign(new Endpoint('/api/quotes'), {
    byId: new Endpoint<'quoteId'>('/api/quotes/{quoteId}'),
  }),
  sandbox: new Endpoint('/api/sandbox'),
  sessions: new Endpoint('/api/sessions'),
};
