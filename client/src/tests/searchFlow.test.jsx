import { screen, act, renderHook, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import Home from '../Components/Home';
import useDebouncedValue from '../hooks/useDebouncedValue';
import { flushPendingDelete } from '../hooks/useDeleteNote';
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

	// the pendingDelete filter only hides the note while the undo window is open —
	// once the id clears, the search cache must not serve it again
	it('a note deleted from the results stays gone after the delete commits', async () => {
		const user = userEvent.setup();
		login('Alice');

		let deleted = false;
		vi.spyOn(global, 'fetch').mockImplementation((url, options) => {
			if (options?.method === 'DELETE') {
				deleted = true;
				return Promise.resolve({ ok: true, json: async () => ({ success: true }) });
			}
			const body = String(url).includes('/search')
				? { success: true, notes: deleted ? [] : [note('s1', 'Milk plans')], nextCursor: null }
				: { success: true, notes: [note('n1', 'Trip plan')], nextCursor: null };
			return Promise.resolve({ ok: true, json: async () => body });
		});

		renderWithProviders(<Home title='Home' />);

		await screen.findByText('Trip plan');
		await user.type(screen.getByRole('textbox', { name: 'Search notes' }), 'milk');
		await screen.findByText('Milk plans');

		await user.click(screen.getByRole('button', { name: /delete note/i }));
		await user.click(await screen.findByRole('button', { name: /^delete$/i }));

		// ends the undo window early, exactly as another note action would
		await act(async () => flushPendingDelete());

		await waitFor(() => expect(screen.queryByText('Milk plans')).not.toBeInTheDocument());
	});
});

// jsdom's matchMedia polyfill reports matches:false, i.e. a mobile viewport
describe('search bar open/close mechanics', () => {
	const setup = async () => {
		const user = userEvent.setup();
		login('Alice');
		mockNotesAndSearch();
		renderWithProviders(<Home title='Home' />);
		await screen.findByText('Trip plan');
		return {
			user,
			icon: screen.getByRole('button', { name: 'Search notes' }),
			input: screen.getByRole('textbox', { name: 'Search notes' }),
			heading: screen.getByRole('heading', { name: 'Your Notes' }),
		};
	};

	it('magnifier tap expands the bar, collapses the heading and focuses the input', async () => {
		const { user, icon, input, heading } = await setup();

		await user.click(icon);

		expect(input).toHaveFocus();
		expect(input.className).toContain('w-36');
		expect(heading.className).toContain('max-w-0');
		expect(heading.className).toContain('opacity-0');
	});

	it('tapping the magnifier again never blurs the input (the snap-shut race)', async () => {
		const { user, icon, input } = await setup();
		const blurSpy = vi.fn();
		input.addEventListener('blur', blurSpy);

		await user.click(icon);
		await user.click(icon);

		expect(blurSpy).not.toHaveBeenCalled();
		expect(input).toHaveFocus();
		expect(input.className).toContain('w-36');
	});

	it('an imprecise tap on the pill padding does not close the bar either', async () => {
		const { user, icon, input } = await setup();

		await user.click(icon);
		await user.click(input.parentElement);

		expect(input).toHaveFocus();
		expect(input.className).toContain('w-36');
	});

	it('tapping outside with an empty box collapses the bar and restores the heading', async () => {
		const { user, icon, input, heading } = await setup();

		await user.click(icon);
		await user.click(screen.getByText('Trip plan'));

		expect(input.className).toContain('w-0');
		expect(heading.className).not.toContain('max-w-0');
		expect(heading.className).toContain('opacity-100');
	});

	it('tapping outside with text in the box keeps the bar open', async () => {
		const { user, icon, input } = await setup();

		await user.click(icon);
		await user.type(input, 'milk');
		await user.click(await screen.findByText('Milk plans'));

		expect(input.className).toContain('w-36');
	});

	it('clearing with the x keeps the input focused and the bar open', async () => {
		const { user, icon, input } = await setup();

		await user.click(icon);
		await user.type(input, 'milk');
		await user.click(screen.getByLabelText('Clear search'));

		expect(input).toHaveValue('');
		expect(input).toHaveFocus();
		expect(input.className).toContain('w-36');
	});

	it('on desktop the magnifier only focuses — the heading never collapses', async () => {
		vi.spyOn(window, 'matchMedia').mockReturnValue({
			matches: true,
			addEventListener: () => {},
			removeEventListener: () => {},
		});
		const { user, icon, input, heading } = await setup();

		await user.click(icon);

		expect(input).toHaveFocus();
		expect(heading.className).not.toContain('max-w-0');
		expect(heading.className).toContain('opacity-100');
	});
});
