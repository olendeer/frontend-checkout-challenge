import { RequestConfig } from 'core/http';
import { Cart, CartItem } from 'domain/contracts';

export interface CartService {
  getCart: (config?: RequestConfig) => Promise<Cart>;
  removeItem: (productId: string, config?: RequestConfig) => Promise<void>;
  setQuantity: (productId: string, quantity: number, config?: RequestConfig) => Promise<CartItem>;
}
