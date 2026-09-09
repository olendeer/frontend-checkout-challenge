import { FetchAdapter, LocalStorageAdapter } from 'core/adapters';
import { IdempotencyJournal } from 'core/idempotency';
import { getApiUrl } from 'core/utils';
import { ApiErrorDto } from 'data/dto/api-response';
import {
  CartRepoImpl,
  CatalogRepoImpl,
  CheckoutRepoImpl,
  OrdersRepoImpl,
  PaymentsRepoImpl,
  SessionRepoImpl,
} from 'data/repositories';
import { CartService, CartServiceImpl } from 'domain/cart';
import { CatalogService, CatalogServiceImpl } from 'domain/catalog';
import { CheckoutService, CheckoutServiceImpl } from 'domain/checkout';
import { OrderService, OrderServiceImpl } from 'domain/order';
import { PaymentService, PaymentServiceImpl } from 'domain/payment';
import { SessionService, SessionServiceImpl } from 'domain/session';

export interface AppServices {
  cart: CartService;
  catalog: CatalogService;
  checkout: CheckoutService;
  order: OrderService;
  payment: PaymentService;
  session: SessionService;
}

export const createServices = (baseUrl: string = getApiUrl()): AppServices => {
  const storage = new LocalStorageAdapter();
  const journal = new IdempotencyJournal(storage);
  const http = new FetchAdapter({ baseUrl, mapError: ApiErrorDto.mapToEntity });

  const cartRepo = new CartRepoImpl(http);
  const ordersRepo = new OrdersRepoImpl(http);
  const session = new SessionServiceImpl(new SessionRepoImpl(http), storage);

  http.setAuthProvider(session);

  return {
    cart: new CartServiceImpl(cartRepo),
    catalog: new CatalogServiceImpl(new CatalogRepoImpl(http)),
    checkout: new CheckoutServiceImpl(new CheckoutRepoImpl(http), cartRepo),
    order: new OrderServiceImpl(ordersRepo, journal),
    payment: new PaymentServiceImpl(new PaymentsRepoImpl(http), ordersRepo, journal),
    session,
  };
};
