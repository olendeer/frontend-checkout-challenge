import { RequestConfig } from 'core/http';
import { Product } from 'domain/catalog/entities';

export interface CatalogRepo {
  getProducts: (config?: RequestConfig) => Promise<Product[]>;
}
