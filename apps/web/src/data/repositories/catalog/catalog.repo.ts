import { RequestConfig } from 'core/http';
import { Product } from 'domain/contracts';

export interface CatalogRepo {
  getProducts: (config?: RequestConfig) => Promise<Product[]>;
}
