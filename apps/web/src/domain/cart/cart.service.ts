import { RequestConfig } from 'core/http';
import { CartItem } from 'domain/contracts';

import { Cart } from './entities';

export interface CartService {
  getCart: (config?: RequestConfig) => Promise<Cart>;
  removeItem: (productId: string, config?: RequestConfig) => Promise<void>;
  setQuantity: (productId: string, quantity: number, config?: RequestConfig) => Promise<CartItem>;
}
