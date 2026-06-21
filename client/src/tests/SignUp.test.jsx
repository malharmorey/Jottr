import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SignUp from '../Components/SignUp';
import AlertToaster from '../Components/AlertToaster';
import { renderWithProviders } from './renderWithProviders';
import { mockFetchOnce } from './mockFetch';

describe('SignUp', () => {
	it('renders the name, username, password and submit controls', () => {
		renderWithProviders(<SignUp title='Sign Up' />);
		expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
		expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
	});

	it('stores the auth token after a successful signup', async () => {
		const user = userEvent.setup();
		mockFetchOnce({ success: true, authToken: 'new.jwt.token' });
		renderWithProviders(<SignUp title='Sign Up' />);

		await user.type(screen.getByLabelText(/full name/i), 'Jane Doe');
		await user.type(screen.getByLabelText(/username/i), 'jane@example.com');
		await user.type(screen.getByLabelText(/password/i), 'Secret1@');
		await user.click(screen.getByRole('button', { name: /sign up/i }));

		await waitFor(() =>
			expect(sessionStorage.getItem('token')).toBe('new.jwt.token')
		);
	});

	it('surfaces a field error from the validator errors[] array', async () => {
		const user = userEvent.setup();
		mockFetchOnce(
			{ success: false, errors: [{ msg: 'Email already in use' }] },
			false
		);
		renderWithProviders(
			<>
				<AlertToaster />
				<SignUp title='Sign Up' />
			</>
		);

		await user.type(screen.getByLabelText(/full name/i), 'Jane Doe');
		await user.type(screen.getByLabelText(/username/i), 'taken@example.com');
		await user.type(screen.getByLabelText(/password/i), 'Secret1@');
		await user.click(screen.getByRole('button', { name: /sign up/i }));

		expect(await screen.findByText(/email already in use/i)).toBeInTheDocument();
	});
});
