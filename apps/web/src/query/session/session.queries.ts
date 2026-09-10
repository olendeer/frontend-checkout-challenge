'use client';

import { useQuery, UseQueryResult } from '@tanstack/react-query';

import { useSessionService } from 'providers/services.hooks';

import { queryKeys } from '../query-keys';

export const useSessionQuery = (): UseQueryResult<string | null> => {
  const session = useSessionService();

  return useQuery({
    queryFn: () => session.ensureToken(),
    queryKey: queryKeys.session(),
    staleTime: Infinity,
  });
};
