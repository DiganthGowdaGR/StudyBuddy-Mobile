import { QueryClient } from '@tanstack/react-query';

/**
 * Global React Query client configured with production defaults.
 * Controls caching, refetching, and failure retry strategies.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});
