'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { PropsWithChildren, useState } from 'react';

import { createQueryClient } from 'query/query-client';

import { createServices } from './services';
import { ServicesContext } from './services.context';
import { SessionGate } from './session-gate.component';

export const AppProvider = ({ children }: PropsWithChildren) => {
  const [services] = useState(() => createServices());
  const [queryClient] = useState(() => createQueryClient());

  return (
    <ServicesContext.Provider value={services}>
      <QueryClientProvider client={queryClient}>
        <SessionGate>{children}</SessionGate>
      </QueryClientProvider>
    </ServicesContext.Provider>
  );
};
