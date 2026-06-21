import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Navbar from '../Components/Navbar';
import { renderWithProviders, login } from './renderWithProviders';

describe('Navbar', () => {
	it('always shows the brand and the Home / About links', () => {
		renderWithProviders(<Navbar />);
		expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
		expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument();
	});

	it('hides the user menu when logged out', () => {
		renderWithProviders(<Navbar />);
		expect(
			screen.queryByRole('button', { name: /user/i })
		).not.toBeInTheDocument();
	});

	it("shows the logged-in user's name", () => {
		login('Alice');
		renderWithProviders(<Navbar />);
		expect(
			screen.getByRole('button', { name: /alice/i })
		).toBeInTheDocument();
	});

	it('clears the token and cached summaries on logout', async () => {
		const user = userEvent.setup();
		login('Alice');
		sessionStorage.setItem('summaries', JSON.stringify({ n1: 'a summary' }));
		renderWithProviders(<Navbar />);

		await user.click(screen.getByRole('button', { name: /alice/i }));
		await user.click(await screen.findByText(/logout/i));

		await waitFor(() => {
			expect(sessionStorage.getItem('token')).toBeNull();
			expect(sessionStorage.getItem('summaries')).toBeNull();
		});
	});
});
