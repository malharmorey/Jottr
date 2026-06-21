import { act, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NoteModal from '../Components/NoteModal';
import useNoteModalStore from '../stores/noteModalStore';
import { renderWithProviders, login } from './renderWithProviders';
import { mockFetch } from './mockFetch';

describe('NoteModal', () => {
	it('opens the add modal from the floating button', async () => {
		const user = userEvent.setup();
		renderWithProviders(<NoteModal />);
		expect(screen.queryByText('New Note')).not.toBeInTheDocument();

		await user.click(screen.getByRole('button', { name: /add a note/i }));
		expect(await screen.findByText('New Note')).toBeInTheDocument();
	});

	it('sends a create request when a valid note is saved', async () => {
		const user = userEvent.setup();
		login('Alice');
		const fetchSpy = mockFetch({
			success: true,
			note: { _id: 'x', title: 'Buy milk', description: 'two litres', tag: '' },
		});
		renderWithProviders(<NoteModal />);

		await user.click(screen.getByRole('button', { name: /add a note/i }));
		await user.type(screen.getByLabelText('Title:'), 'Buy milk');
		await user.type(screen.getByLabelText('Note:'), 'two litres');
		await user.click(screen.getByRole('button', { name: /save/i }));

		await waitFor(() => expect(fetchSpy).toHaveBeenCalled());
		expect(fetchSpy.mock.calls[0][0]).toContain('/addnote');
	});

	it('skips the update when an edited note is left unchanged', async () => {
		const user = userEvent.setup();
		login('Alice');
		const note = {
			_id: 'n1',
			title: 'Title one',
			description: 'Description one',
			tag: 'work',
		};
		const fetchSpy = mockFetch({ success: true });
		const { queryClient } = renderWithProviders(<NoteModal />);
		queryClient.setQueryData(['notes'], { notes: [note] });

		act(() => useNoteModalStore.getState().openEdit(note));
		await screen.findByText('Edit Note');
		await user.click(screen.getByRole('button', { name: /save/i }));

		expect(fetchSpy).not.toHaveBeenCalled();
	});
});
