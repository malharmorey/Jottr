import { useNavigate } from 'react-router';
import { login as loginRequest } from '../api/auth';
import useAuth from './useAuth';
import useAlertStore from '../stores/alertStore';

const useLogin = () => {
	const navigate = useNavigate();
	const { login } = useAuth();
	const showAlert = useAlertStore((state) => state.showAlert);

	return async (credentials) => {
		try {
			const { authToken } = await loginRequest(credentials);
			login(authToken);
			showAlert('Successfully logged in', 'success');
			navigate('/');
		} catch (error) {
			showAlert(error.message, 'danger');
		}
	};
};

export default useLogin;
