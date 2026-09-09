import { HttpClient, RequestConfig } from 'core/http';
import { API } from 'data/endpoints';
import { Cart, CartItem } from 'domain/contracts';

import { CartRepo } from './cart.repo';
import { SetCartItemPayload } from './cart.repo.payload';

export class CartRepoImpl implements CartRepo {
  constructor(private readonly _http: HttpClient) {}

  getCart = async (config?: RequestConfig): Promise<Cart> => {
    const response = await this._http.get<Cart>(API.cart.toUrl(), config);

    return response.data;
  };

  setItem = async (
    productId: string,
    payload: SetCartItemPayload,
    config?: RequestConfig,
  ): Promise<CartItem> => {
    const response = await this._http.put<CartItem, SetCartItemPayload>(
      API.cart.item.toUrl({ productId }),
      payload,
      config,
    );

    return response.data;
  };

  deleteItem = async (productId: string, config?: RequestConfig): Promise<void> => {
    await this._http.delete(API.cart.item.toUrl({ productId }), config);
  };
}
