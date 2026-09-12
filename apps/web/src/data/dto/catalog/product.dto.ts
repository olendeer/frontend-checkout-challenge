import type { Product as ProductResponse } from '@checkout/contracts';

import { Product } from 'domain/catalog/entities';

export class ProductDto {
  static mapToEntity(values: ProductResponse): Product {
    return new Product(
      values.id,
      values.sku,
      values.title,
      values.description,
      values.price,
      values.currency,
      values.stock,
    );
  }

  static mapToEntityList(values: ProductResponse[]): Product[] {
    return values.map(ProductDto.mapToEntity);
  }
}
