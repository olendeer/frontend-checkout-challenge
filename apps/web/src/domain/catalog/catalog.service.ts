import { RequestConfig } from 'core/http';
import { Product } from 'domain/contracts';

export interface CatalogService {
  getProducts: (config?: RequestConfig) => Promise<Product[]>;
}
