import { screen, act, renderHook } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import Home from '../Components/Home';
import useDebouncedValue from '../hooks/useDebouncedValue';
import { renderWithProviders, login } from './renderWithProviders';

const note = (id, title) => ({
	_id: id,
	title,
	description: `Body of ${title}`,
	tag: 'home',
	date: Date.now(),
});

// getallnotes serves the full list; /search answers per q
const mockNotesAndSearch = () =>
	vi.spyOn(global, 'fetch').mockImplementation((url) => {
		const s = String(url);
		let body;
		if (s.includes('/search')) {
			const q = new URL(s, 'http://test').searchParams.get('q');
			body =
				q === 'milk'
					? { success: true, notes: [note('s1', 'Milk plans')], nextCursor: null }
					: { success: true, notes: [], nextCursor: null };
		} else {
			body = { success: true, notes: [note('n1', 'Trip plan')], nextCursor: null };
		}
		return Promise.resolve({ ok: true, json: async () => body });
	});

describe('useDebouncedValue', () => {
	it('only passes the value along after the delay', () => {
		vi.useFakeTimers();
		const { result, rerender } = renderHook(
			({ value }) => useDebouncedValue(value, 300),
			{ initialProps: { value: 'a' } }
		);

		rerender({ value: 'ab' });
		expect(result.current).toBe('a');

		act(() => vi.advanceTimersByTime(299));
		expect(result.current).toBe('a');

		act(() => vi.advanceTimersByTime(1));
		expect(result.current).toBe('ab');
		vi.useRealTimers();
	});
});

describe('note search flow', () => {
	it('searches once after a typing pause and shows the matches', async () => {
		const user = userEvent.setup();
		login('Alice');
		const fetchSpy = mockNotesAndSearch();
		renderWithProviders(<Home title='Home' />);

		await screen.findByText('Trip plan');
		await user.type(screen.getByRole('textbox', { name: 'Search notes' }), 'milk');

		expect(await screen.findByText('Milk plans')).toBeInTheDocument();
		expect(screen.queryByText('Trip plan')).not.toBeInTheDocument();

		const searchCalls = fetchSpy.mock.calls.filter((call) =>
			String(call[0]).includes('/search')
		);
		expect(searchCalls).toHaveLength(1);
		expect(String(searchCalls[0][0])).toContain('q=milk');
	});

	it('clearing with the x restores the full list', async () => {
		const user = userEvent.setup();
		login('Alice');
		mockNotesAndSearch();
		renderWithProviders(<Home title='Home' />);

		await screen.findByText('Trip plan');
		await user.type(screen.getByRole('textbox', { name: 'Search notes' }), 'milk');
		await screen.findByText('Milk plans');

		await user.click(screen.getByLabelText('Clear search'));

		expect(await screen.findByText('Trip plan')).toBeInTheDocument();
		expect(screen.getByRole('textbox', { name: 'Search notes' })).toHaveValue('');
	});

	it('says so when nothing matches', async () => {
		const user = userEvent.setup();
		login('Alice');
		mockNotesAndSearch();
		renderWithProviders(<Home title='Home' />);

		await screen.findByText('Trip plan');
		await user.type(screen.getByRole('textbox', { name: 'Search notes' }), 'zzz');

		expect(await screen.findByText(/no notes match/i)).toBeInTheDocument();
	});
});
