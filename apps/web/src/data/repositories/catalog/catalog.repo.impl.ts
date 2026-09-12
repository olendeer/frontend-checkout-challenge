import type { Product as ProductResponse } from '@checkout/contracts';

import { HttpClient, RequestConfig } from 'core/http';
import { ProductDto } from 'data/dto/catalog';
import { API } from 'data/endpoints';
import { Product } from 'domain/catalog/entities';

import { CatalogRepo } from './catalog.repo';

export class CatalogRepoImpl implements CatalogRepo {
  constructor(private readonly _http: HttpClient) {}

  getProducts = async (config?: RequestConfig): Promise<Product[]> => {
    const response = await this._http.get<ProductResponse[]>(API.products.toUrl(), config);

    return ProductDto.mapToEntityList(response.data);
  };
}
