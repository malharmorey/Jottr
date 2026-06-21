import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router';

export const renderWithProviders = (ui, { route = '/' } = {}) => {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: { retry: false },
			mutations: { retry: false },
		},
	});
	return {
		queryClient,
		...render(
			<QueryClientProvider client={queryClient}>
				<MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
			</QueryClientProvider>
		),
	};
};

export const makeToken = (name = 'Test User') => {
	const payload = btoa(JSON.stringify({ user: { name } }))
		.replace(/\+/g, '-')
		.replace(/\//g, '_');
	return `header.${payload}.signature`;
};

export const login = (name) => sessionStorage.setItem('token', makeToken(name));
