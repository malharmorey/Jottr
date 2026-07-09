import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import NotesList from '../Components/NotesList';
import ConfirmDeleteModal from '../Components/ConfirmDeleteModal';
import AlertToaster from '../Components/AlertToaster';
import { renderWithProviders, login } from './renderWithProviders';

const note = {
	_id: 'n1',
	title: 'Pay the rent',
	description: 'Due on the first',
	tag: 'todo',
	date: Date.now(),
};

const renderScreen = () =>
	renderWithProviders(
		<>
			<NotesList />
			<ConfirmDeleteModal />
			<AlertToaster />
		</>
	);

const confirmDelete = async (user) => {
	await screen.findByText('Pay the rent');
	await user.click(screen.getByRole('button', { name: /delete note/i }));
	await screen.findByText('Warning!');
	await user.click(screen.getByRole('button', { name: /^delete$/i }));
	await screen.findByText('Note deleted');
};

describe('delete commit', () => {
	it('sends the real DELETE when the undo toast is closed', async () => {
		const user = userEvent.setup();
		login('Alice');
		// once the DELETE lands the note is really gone, so a refetch must not serve it again
		let deleted = false;
		const fetchSpy = vi.fn((url) => {
			if (String(url).includes('deletenote')) {
				deleted = true;
				return Promise.resolve({ ok: true, json: async () => ({ success: true }) });
			}
			return Promise.resolve({
				ok: true,
				json: async () => ({ success: true, notes: deleted ? [] : [note] }),
			});
		});
		global.fetch = fetchSpy;
		renderScreen();

		await confirmDelete(user);
		await user.click(screen.getByRole('button', { name: /close/i }));

		await waitFor(() => {
			const del = fetchSpy.mock.calls.find((c) =>
				String(c[0]).includes('deletenote')
			);
			expect(del).toBeTruthy();
			expect(del[1].method).toBe('DELETE');
		});
		expect(screen.queryByText('Pay the rent')).not.toBeInTheDocument();
	});

	it('restores the note and toasts when the delete fails', async () => {
		const user = userEvent.setup();
		login('Alice');
		global.fetch = vi.fn((url) =>
			String(url).includes('deletenote')
				? Promise.resolve({
						ok: false,
						json: async () => ({ success: false, message: 'Delete failed' }),
				  })
				: Promise.resolve({
						ok: true,
						json: async () => ({ success: true, notes: [note] }),
				  })
		);
		renderScreen();

		await confirmDelete(user);
		await user.click(screen.getByRole('button', { name: /close/i }));

		expect(await screen.findByText('Delete failed')).toBeInTheDocument();
		expect(await screen.findByText('Pay the rent')).toBeInTheDocument();
	});
});
