// Prefetching utilities for React Query
import { QueryClient } from '@tanstack/react-query';

// Prefetch common data that users are likely to need
export const prefetchCommonData = async (queryClient) => {
  const prefetchPromises = [];

  // Prefetch user data if authenticated
  if (typeof window !== 'undefined' && localStorage.getItem('token')) {
    prefetchPromises.push(
      queryClient.prefetchQuery({
        queryKey: ['user'],
        queryFn: async () => {
          const response = await fetch('/api/auth/me', {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });
          if (!response.ok) throw new Error('Failed to fetch user');
          return response.json();
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
      })
    );
  }

  // Prefetch static data that doesn't change often
  const staticQueries = [
    { key: ['notices'], url: '/api/notices' },
    { key: ['facilities'], url: '/api/facilities' },
    { key: ['academics'], url: '/api/academics' },
    { key: ['achievements'], url: '/api/achievements' },
    { key: ['banners'], url: '/api/banners' },
  ];

  staticQueries.forEach(({ key, url }) => {
    prefetchPromises.push(
      queryClient.prefetchQuery({
        queryKey: key,
        queryFn: async () => {
          const response = await fetch(url);
          if (!response.ok) throw new Error(`Failed to fetch ${key[0]}`);
          return response.json();
        },
        staleTime: 30 * 60 * 1000, // 30 minutes for static data
      })
    );
  });

  try {
    await Promise.all(prefetchPromises);
    console.log('[Prefetch] Common data prefetched successfully');
  } catch (error) {
    console.warn('[Prefetch] Some prefetching failed:', error);
  }
};

// Prefetch data for specific routes
export const prefetchRouteData = async (queryClient, route) => {
  const routePrefetchMap = {
    '/dashboard': [
      { key: ['dashboard-stats'], url: '/api/dashboard/stats' },
    ],
    '/dashboard/students': [
      { key: ['students'], url: '/api/students' },
    ],
    '/dashboard/teachers': [
      { key: ['teachers'], url: '/api/teachers' },
    ],
    '/dashboard/salary': [
      { key: ['salaries'], url: '/api/salaries' },
      { key: ['salary-statistics'], url: '/api/salaries/statistics' },
      { key: ['salary-helpers'], url: '/api/salaries/helpers' },
    ],
    '/dashboard/fees': [
      { key: ['fees'], url: '/api/fees' },
    ],
    '/dashboard/expenses': [
      { key: ['expenses'], url: '/api/expenses' },
    ],
  };

  const prefetchItems = routePrefetchMap[route];
  if (!prefetchItems) return;

  const prefetchPromises = prefetchItems.map(async ({ key, url }) => {
    try {
      await queryClient.prefetchQuery({
        queryKey: key,
        queryFn: async () => {
          const response = await fetch(url, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });
          if (!response.ok) throw new Error(`Failed to fetch ${key[0]}`);
          return response.json();
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
      });
    } catch (error) {
      console.warn(`[Prefetch] Failed to prefetch ${key[0]}:`, error);
    }
  });

  await Promise.all(prefetchPromises);
  console.log(`[Prefetch] Route data prefetched for ${route}`);
};

// Prefetch on hover (for links/buttons that navigate to data-heavy pages)
export const prefetchOnHover = (queryClient, route) => {
  return () => prefetchRouteData(queryClient, route);
};

// Prefetch on focus (for accessibility)
export const prefetchOnFocus = (queryClient, route) => {
  return () => prefetchRouteData(queryClient, route);
};

// Background sync utility
export const setupBackgroundSync = (queryClient) => {
  // Sync when coming back online
  const handleOnline = () => {
    console.log('[Background Sync] Back online, syncing data...');
    // Invalidate and refetch stale queries
    queryClient.invalidateQueries({
      refetchType: 'active', // Only refetch active queries
    });
  };

  if (typeof window !== 'undefined') {
    window.addEventListener('online', handleOnline);

    // Also sync periodically when online
    const syncInterval = setInterval(() => {
      if (navigator.onLine) {
        queryClient.invalidateQueries({
          refetchType: 'none', // Don't refetch, just mark as stale
        });
      }
    }, 5 * 60 * 1000); // Every 5 minutes

    // Cleanup
    return () => {
      window.removeEventListener('online', handleOnline);
      clearInterval(syncInterval);
    };
  }
};

// Optimistic update helpers
export const createOptimisticUpdate = (queryClient, queryKey, updateFn) => {
  return async (variables) => {
    // Cancel any outgoing refetches
    await queryClient.cancelQueries({ queryKey });

    // Snapshot the previous value
    const previousData = queryClient.getQueryData(queryKey);

    // Optimistically update to the new value
    queryClient.setQueryData(queryKey, (old) => updateFn(old, variables));

    // Return a context object with the snapshotted value
    return { previousData };
  };
};

export const rollbackOptimisticUpdate = (queryClient, queryKey, context) => {
  if (context?.previousData) {
    queryClient.setQueryData(queryKey, context.previousData);
  }
};