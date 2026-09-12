import { RequestConfig } from 'core/http';

import { Product } from './entities';

export interface CatalogService {
  getProducts: (config?: RequestConfig) => Promise<Product[]>;
}
