import { QueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 30 * 1000, // data stays fresh for 30s before a refetch
			retry: 1,
		},
		mutations: {
			retry: 0, // never auto-retry writes
		},
	},
});

export default queryClient;