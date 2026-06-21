import { act, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import NoteModal from '../Components/NoteModal';
import NotesList from '../Components/NotesList';
import AlertToaster from '../Components/AlertToaster';
import useNoteModalStore from '../stores/noteModalStore';
import { renderWithProviders, login } from './renderWithProviders';

const note = {
	_id: 'n1',
	title: 'Title one',
	description: 'Description one',
	tag: 'work',
	date: Date.now(),
};

describe('edit note', () => {
	it('sends an update request when a field actually changes', async () => {
		const user = userEvent.setup();
		login('Alice');
		const fetchSpy = vi.fn().mockResolvedValue({
			ok: true,
			json: async () => ({ success: true, message: 'updated' }),
		});
		global.fetch = fetchSpy;

		const { queryClient } = renderWithProviders(<NoteModal />);
		queryClient.setQueryData(['notes'], { notes: [note] });
		act(() => useNoteModalStore.getState().openEdit(note));
		await screen.findByText('Edit Note');

		const title = screen.getByLabelText('Title:');
		await user.clear(title);
		await user.type(title, 'Title one edited');
		await user.click(screen.getByRole('button', { name: /save/i }));

		await waitFor(() => expect(fetchSpy).toHaveBeenCalled());
		expect(String(fetchSpy.mock.calls[0][0])).toContain('/updatenote/n1');
	});

	it('rolls the note back and toasts when the update fails', async () => {
		const user = userEvent.setup();
		login('Alice');
		// GET getallnotes succeeds; PUT updatenote fails
		global.fetch = vi.fn((url) =>
			String(url).includes('updatenote')
				? Promise.resolve({
						ok: false,
						json: async () => ({ success: false, message: 'Update failed' }),
				  })
				: Promise.resolve({
						ok: true,
						json: async () => ({ success: true, notes: [note] }),
				  })
		);

		renderWithProviders(
			<>
				<NotesList />
				<NoteModal />
				<AlertToaster />
			</>
		);

		await screen.findByText('Title one');
		await user.click(screen.getByRole('button', { name: /edit note/i }));
		const title = await screen.findByLabelText('Title:');
		await user.clear(title);
		await user.type(title, 'A doomed edit');
		await user.click(screen.getByRole('button', { name: /save/i }));

		expect(await screen.findByText('Update failed')).toBeInTheDocument();
		await waitFor(() => {
			expect(screen.getByText('Title one')).toBeInTheDocument();
			expect(screen.queryByText('A doomed edit')).not.toBeInTheDocument();
		});
	});
});
