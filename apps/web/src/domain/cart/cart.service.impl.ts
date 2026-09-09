import { RequestConfig } from 'core/http';
import { CartRepo } from 'data/repositories';
import { Cart, CartItem } from 'domain/contracts';

import { CartService } from './cart.service';

export class CartServiceImpl implements CartService {
  constructor(private readonly _repo: CartRepo) {}

  getCart = (config?: RequestConfig): Promise<Cart> => this._repo.getCart(config);

  setQuantity = (productId: string, quantity: number, config?: RequestConfig): Promise<CartItem> =>
    this._repo.setItem(productId, { quantity }, config);

  removeItem = (productId: string, config?: RequestConfig): Promise<void> =>
    this._repo.deleteItem(productId, config);
}
