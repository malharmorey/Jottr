const TOKEN_KEY = 'token';

const decodeJwt = (token) => {
	if (!token) return null;
	try {
		const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
		return JSON.parse(atob(payload));
	} catch {
		return null;
	}
};

const useAuth = () => {
	const token = localStorage.getItem(TOKEN_KEY);
	const userName = decodeJwt(token)?.user?.name;

	const login = (authToken) => {
		localStorage.setItem(TOKEN_KEY, authToken);
	};

	const logout = () => {
		localStorage.removeItem(TOKEN_KEY);
	};

	return {
		token,
		userName,
		isLoggedIn: token !== null,
		login,
		logout,
	};
};

export default useAuth;
