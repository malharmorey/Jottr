import { screen } from '@testing-library/react';
import NotesList from '../Components/NotesList';
import { renderWithProviders, login } from './renderWithProviders';
import { mockFetch } from './mockFetch';

const sampleNote = {
	_id: 'n1',
	title: 'Remember the milk',
	description: 'And the eggs',
	tag: 'home',
	date: Date.now(),
};

describe('NotesList', () => {
	it('renders nothing when the user is logged out', () => {
		const { container } = renderWithProviders(<NotesList />);
		expect(container).toBeEmptyDOMElement();
	});

	it('renders the fetched notes for a logged-in user', async () => {
		login('Alice');
		mockFetch({ success: true, notes: [sampleNote], nextCursor: null });
		renderWithProviders(<NotesList />);
		expect(await screen.findByText('Remember the milk')).toBeInTheDocument();
	});

	it('shows the empty-state card when there are no notes', async () => {
		login('Alice');
		mockFetch({ success: true, notes: [], nextCursor: null });
		renderWithProviders(<NotesList />);
		expect(await screen.findByText(/nothing in here/i)).toBeInTheDocument();
	});
});
