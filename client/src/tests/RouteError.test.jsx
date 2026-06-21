import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { MemoryRouter } from 'react-router';
import RouteError from '../Components/RouteError';

// drive useRouteError per test; treat anything with a numeric status as a
// route error response (the real guard is a branded type we can't fabricate).
const state = vi.hoisted(() => ({ error: null }));
vi.mock('react-router', async (importOriginal) => {
	const actual = await importOriginal();
	return {
		...actual,
		useRouteError: () => state.error,
		isRouteErrorResponse: (e) => !!e && typeof e.status === 'number',
	};
});

const renderError = (error) => {
	state.error = error;
	return render(
		<MemoryRouter>
			<RouteError />
		</MemoryRouter>
	);
};

describe('RouteError', () => {
	it('shows the 404 message when there is no error (catch-all route)', () => {
		renderError(null);
		expect(screen.getByText(/lost in space/i)).toBeInTheDocument();
		expect(screen.getByRole('link', { name: /take me home/i })).toBeInTheDocument();
	});

	it('shows the status and text for a route error response', () => {
		renderError({ status: 500, statusText: 'Server Error' });
		expect(screen.getByText(/500 — Server Error/i)).toBeInTheDocument();
	});

	it('shows a generic message for a thrown error', () => {
		renderError(new Error('boom'));
		expect(screen.getByText(/houston, we have a problem/i)).toBeInTheDocument();
	});
});
