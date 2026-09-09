import { RequestConfig } from 'core/http';
import { CatalogRepo } from 'data/repositories';
import { Product } from 'domain/contracts';

import { CatalogService } from './catalog.service';

export class CatalogServiceImpl implements CatalogService {
  constructor(private readonly _repo: CatalogRepo) {}

  getProducts = (config?: RequestConfig): Promise<Product[]> => this._repo.getProducts(config);
}
