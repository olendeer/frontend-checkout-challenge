'use client';

import { useQuery, UseQueryResult } from '@tanstack/react-query';

import { Product } from 'domain/catalog';
import { useCatalogService } from 'providers/services.hooks';

import { queryKeys } from '../query-keys';

export const useProductsQuery = (): UseQueryResult<Product[]> => {
  const catalog = useCatalogService();

  return useQuery({
    queryFn: ({ signal }) => catalog.getProducts({ signal }),
    queryKey: queryKeys.products(),
  });
};
