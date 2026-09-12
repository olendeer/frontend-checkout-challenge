import type { Cart as CartResponse } from '@checkout/contracts';

import { HttpClient, RequestConfig } from 'core/http';
import { CartDto } from 'data/dto/cart';
import { API } from 'data/endpoints';
import { Cart } from 'domain/cart/entities';
import { CartItem } from 'domain/contracts';

import { CartRepo } from './cart.repo';
import { SetCartItemPayload } from './cart.repo.payload';

export class CartRepoImpl implements CartRepo {
  constructor(private readonly _http: HttpClient) {}

  getCart = async (config?: RequestConfig): Promise<Cart> => {
    const response = await this._http.get<CartResponse>(API.cart.toUrl(), config);

    return CartDto.mapToEntity(response.data);
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
