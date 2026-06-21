import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router';

// Wrap a component in the providers it needs (TanStack Query + Router).
// A fresh QueryClient per render keeps tests isolated; retries off so failed
// requests surface immediately instead of being retried.
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

// useAuth reads a JWT from sessionStorage and decodes the middle segment for
// `user.name`. This builds a matching fake token so tests can log a user in.
export const makeToken = (name = 'Test User') => {
	const payload = btoa(JSON.stringify({ user: { name } }))
		.replace(/\+/g, '-')
		.replace(/\//g, '_');
	return `header.${payload}.signature`;
};

export const login = (name) => sessionStorage.setItem('token', makeToken(name));
