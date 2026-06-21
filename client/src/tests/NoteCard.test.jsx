import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NoteCard from '../Components/NoteCard';
import useConfirmDeleteStore from '../stores/confirmDeleteStore';
import useNoteModalStore from '../stores/noteModalStore';

const note = {
	_id: 'n1',
	title: 'Grocery list',
	description: 'Milk, eggs and bread',
	tag: 'home',
	date: Date.now(),
};

describe('NoteCard', () => {
	it('renders the title, description and tag', () => {
		render(<NoteCard {...note} id={note._id} note={note} />);
		expect(screen.getByText('Grocery list')).toBeInTheDocument();
		expect(screen.getByText('Milk, eggs and bread')).toBeInTheDocument();
		expect(screen.getByText('home')).toBeInTheDocument();
	});

	it('opens the confirm-delete store with the note id', async () => {
		const user = userEvent.setup();
		render(<NoteCard {...note} id={note._id} note={note} />);
		await user.click(screen.getByRole('button', { name: /delete note/i }));
		expect(useConfirmDeleteStore.getState().id).toBe('n1');
	});

	it('opens the edit modal pre-filled with the note', async () => {
		const user = userEvent.setup();
		render(<NoteCard {...note} id={note._id} note={note} />);
		await user.click(screen.getByRole('button', { name: /edit note/i }));
		const state = useNoteModalStore.getState();
		expect(state.open).toBe(true);
		expect(state.mode).toBe('edit');
		expect(state.draft.title).toBe('Grocery list');
	});

	it('hides the action buttons on the empty-state placeholder card', () => {
		render(<NoteCard title='Nothing here' date='' />);
		expect(screen.getByRole('button', { name: /edit note/i })).toHaveClass(
			'hidden'
		);
	});
});
