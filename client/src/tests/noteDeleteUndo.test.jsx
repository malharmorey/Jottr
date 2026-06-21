import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NotesList from '../Components/NotesList';
import ConfirmDeleteModal from '../Components/ConfirmDeleteModal';
import AlertToaster from '../Components/AlertToaster';
import { renderWithProviders, login } from './renderWithProviders';
import { mockFetch } from './mockFetch';

const note = {
	_id: 'n1',
	title: 'Cancel the subscription',
	description: 'Before the trial ends',
	tag: 'todo',
	date: Date.now(),
};

const renderNotesScreen = () =>
	renderWithProviders(
		<>
			<NotesList />
			<ConfirmDeleteModal />
			<AlertToaster />
		</>
	);

describe('delete + undo flow', () => {
	it('confirms a delete, hides the note, then restores it on undo without deleting', async () => {
		const user = userEvent.setup();
		login('Alice');
		const fetchSpy = mockFetch({ success: true, notes: [note] });
		renderNotesScreen();

		// note is on screen
		await screen.findByText('Cancel the subscription');

		// open the confirm modal from the card, then confirm
		await user.click(screen.getByRole('button', { name: /delete note/i }));
		await screen.findByText('Warning!');
		await user.click(screen.getByRole('button', { name: /^delete$/i }));

		// note is hidden and an undo toast appears
		await waitFor(() =>
			expect(
				screen.queryByText('Cancel the subscription')
			).not.toBeInTheDocument()
		);
		expect(screen.getByText('Note deleted')).toBeInTheDocument();

		// undo brings it back
		await user.click(screen.getByRole('button', { name: /undo/i }));
		expect(
			await screen.findByText('Cancel the subscription')
		).toBeInTheDocument();

		// the real DELETE was never sent
		const calledDelete = fetchSpy.mock.calls.some((c) =>
			String(c[0]).includes('deletenote')
		);
		expect(calledDelete).toBe(false);
	});
});
