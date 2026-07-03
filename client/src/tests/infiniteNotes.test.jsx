import { screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import NotesList from '../Components/NotesList';
import { useDeleteNote } from '../hooks/useDeleteNote';
import { useEditNote } from '../hooks/useEditNote';
import { renderWithProviders, login } from './renderWithProviders';
import { mockFetch } from './mockFetch';

const note = (id, title) => ({
	_id: id,
	title,
	description: `Body of ${title}`,
	tag: 'home',
	date: Date.now(),
});

// remembers observer callbacks so a test can push the sentinel into view
let ioCallbacks;
beforeEach(() => {
	ioCallbacks = [];
	global.IntersectionObserver = class {
		constructor(callback) {
			ioCallbacks.push(callback);
		}
		observe() {}
		unobserve() {}
		disconnect() {}
	};
});

const scrollSentinelIntoView = () =>
	act(() => ioCallbacks.forEach((callback) => callback([{ isIntersecting: true }])));

const pagedFetch = (pagesByCursor) =>
	vi.spyOn(global, 'fetch').mockImplementation((url) => {
		const cursor =
			new URL(String(url), 'http://test').searchParams.get('cursor') || 'first';
		return Promise.resolve({ ok: true, json: async () => pagesByCursor[cursor] });
	});

describe('infinite notes list', () => {
	it('loads the next page when the sentinel comes into view', async () => {
		login('Alice');
		const fetchSpy = pagedFetch({
			first: { success: true, notes: [note('n1', 'Page one note')], nextCursor: 'n1' },
			n1: { success: true, notes: [note('n2', 'Page two note')], nextCursor: null },
		});
		renderWithProviders(<NotesList />);

		expect(await screen.findByText('Page one note')).toBeInTheDocument();
		expect(screen.queryByText('Page two note')).not.toBeInTheDocument();

		scrollSentinelIntoView();

		expect(await screen.findByText('Page two note')).toBeInTheDocument();
		expect(String(fetchSpy.mock.calls[1][0])).toContain('cursor=n1');
	});

	it('shows the end note only once every page is loaded', async () => {
		login('Alice');
		pagedFetch({
			first: { success: true, notes: [note('n1', 'Page one note')], nextCursor: 'n1' },
			n1: { success: true, notes: [note('n2', 'Page two note')], nextCursor: null },
		});
		renderWithProviders(<NotesList />);

		await screen.findByText('Page one note');
		expect(screen.queryByText(/no more notes down here/i)).not.toBeInTheDocument();

		scrollSentinelIntoView();

		await screen.findByText('Page two note');
		expect(screen.getByText(/no more notes down here/i)).toBeInTheDocument();
	});

	it('commits a pending delete as soon as an edit starts', async () => {
		const user = userEvent.setup();
		login('Alice');
		const fetchSpy = mockFetch({ success: true });

		function Harness() {
			const { requestDelete } = useDeleteNote();
			const { mutate: editNote } = useEditNote();
			return (
				<>
					<button onClick={() => requestDelete('n1')}>del</button>
					<button
						onClick={() =>
							editNote({ id: 'n2', title: 'New', description: 'New body', tag: '' })
						}
					>
						edit
					</button>
				</>
			);
		}
		renderWithProviders(<Harness />);

		await user.click(screen.getByText('del'));
		expect(fetchSpy).not.toHaveBeenCalled();

		await user.click(screen.getByText('edit'));

		await waitFor(() => {
			const urls = fetchSpy.mock.calls.map((call) => String(call[0]));
			expect(urls.some((url) => url.includes('/deletenote/n1'))).toBe(true);
			expect(urls.some((url) => url.includes('/updatenote/n2'))).toBe(true);
		});
	});
});
