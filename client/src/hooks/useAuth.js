const TOKEN_KEY = 'token';

const useAuth = () => {
	const token = localStorage.getItem(TOKEN_KEY);

	const login = (authToken) => {
		localStorage.setItem(TOKEN_KEY, authToken);
	};

	const logout = () => {
		localStorage.removeItem(TOKEN_KEY);
	};

	return {
		token,
		isLoggedIn: token !== null,
		login,
		logout,
	};
};

export default useAuth;
