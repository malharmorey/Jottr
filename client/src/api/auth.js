const host = import.meta.env.VITE_HOST;

const headers = { 'Content-Type': 'application/json' };

const request = async (url, options, fallback) => {
	let response;
	try {
		response = await fetch(url, options);
	} catch {
		throw new Error(fallback);
	}
	const data = await response.json();
	if (!response.ok || !data.success) {
		if (Array.isArray(data.errors)) {
			throw new Error(data.errors.map((e) => e.msg).join('; '));
		}
		throw new Error(data.message || fallback);
	}
	return data;
};

// POST log in → { success, authToken }
export const login = ({ email, password }) =>
	request(
		`${host}/api/auth/login`,
		{
			method: 'POST',
			headers,
			body: JSON.stringify({ email, password }),
		},
		'Unable to log in'
	);

// POST create a new account → { success, authToken }
export const createUser = ({ name, email, password }) =>
	request(
		`${host}/api/auth/createUser`,
		{
			method: 'POST',
			headers,
			body: JSON.stringify({ name, email, password }),
		},
		'Unable to sign up'
	);
