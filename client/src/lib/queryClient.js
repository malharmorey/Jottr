import { QueryClient, QueryCache } from '@tanstack/react-query';
import useAlertStore from '../stores/alertStore';

const queryClient = new QueryClient({
	// Gobal Cache for any failed read
	queryCache: new QueryCache({
		onError: (error, query) => {
			if (query.meta?.skipGlobalError) return;
			const message = query.meta?.errorMessage || error.message;
			useAlertStore.getState().showAlert(message, 'danger');
		},
	}),
	defaultOptions: {
		queries: {
			staleTime: 30 * 1000,
			retry: 1,
		},
		mutations: {
			retry: 0,
		},
	},
});

export default queryClient;