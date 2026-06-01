import { useNavigate } from 'react-router';
import { createUser } from '../api/auth';
import useAuth from './useAuth';
import useAlertStore from '../stores/alertStore';

const useSignup = () => {
	const navigate = useNavigate();
	const { login } = useAuth();
	const showAlert = useAlertStore((state) => state.showAlert);

	return async (credentials) => {
		try {
			const { authToken } = await createUser(credentials);
			login(authToken);
			showAlert('Account created successfully!', 'success');
			navigate('/');
		} catch (error) {
			showAlert(error.message, 'danger');
		}
	};
};

export default useSignup;
