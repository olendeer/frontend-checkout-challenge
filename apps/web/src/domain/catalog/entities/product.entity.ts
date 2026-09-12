import { QuantityIndex } from 'domain/cart/cart.types';
import { Currency } from 'domain/contracts';

const MAX_ITEM_QUANTITY = 99;

export class Product {
  constructor(
    public readonly id: string,
    public readonly sku: string,
    public readonly title: string,
    public readonly description: string,
    public readonly price: number,
    public readonly currency: Currency,
    public readonly stock: number,
  ) {}

  get isAvailable(): boolean {
    return this.stock > 0;
  }

  // Остаток ограничивает количество в одной корзине, но не выше лимита API.
  get maxQuantity(): number {
    return Math.min(this.stock, MAX_ITEM_QUANTITY);
  }

  // Один проход вместо find по массиву на каждую карточку каталога.
  static toStockIndex(products: Product[] = []): QuantityIndex {
    return products.reduce(
      (index, product) => index.set(product.id, product.maxQuantity),
      new Map<string, number>(),
    );
  }
}
