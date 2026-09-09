import { HttpClient, RequestConfig } from 'core/http';
import { API } from 'data/endpoints';
import { Product } from 'domain/contracts';

import { CatalogRepo } from './catalog.repo';

export class CatalogRepoImpl implements CatalogRepo {
  constructor(private readonly _http: HttpClient) {}

  getProducts = async (config?: RequestConfig): Promise<Product[]> => {
    const response = await this._http.get<Product[]>(API.products.toUrl(), config);

    return response.data;
  };
}
