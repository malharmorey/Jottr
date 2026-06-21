import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Login from '../Components/Login';
import AlertToaster from '../Components/AlertToaster';
import { renderWithProviders } from './renderWithProviders';
import { mockFetchOnce } from './mockFetch';

describe('Login', () => {
	it('renders the username, password and submit controls', () => {
		renderWithProviders(<Login title='Login' />);
		expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
		expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
	});

	it('stores the auth token after a successful login', async () => {
		const user = userEvent.setup();
		mockFetchOnce({ success: true, authToken: 'fake.jwt.token' });
		renderWithProviders(<Login title='Login' />);

		await user.type(screen.getByLabelText(/username/i), 'jane@example.com');
		await user.type(screen.getByLabelText(/password/i), 'Secret1@');
		await user.click(screen.getByRole('button', { name: /log in/i }));

		await waitFor(() =>
			expect(sessionStorage.getItem('token')).toBe('fake.jwt.token')
		);
	});

	it('shows an error toast when the credentials are wrong', async () => {
		const user = userEvent.setup();
		mockFetchOnce({ success: false, message: 'Incorrect password' }, false);
		renderWithProviders(
			<>
				<AlertToaster />
				<Login title='Login' />
			</>
		);

		await user.type(screen.getByLabelText(/username/i), 'jane@example.com');
		await user.type(screen.getByLabelText(/password/i), 'wrongpass');
		await user.click(screen.getByRole('button', { name: /log in/i }));

		expect(await screen.findByText(/incorrect password/i)).toBeInTheDocument();
		expect(sessionStorage.getItem('token')).toBeNull();
	});
});
