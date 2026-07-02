import jwt from 'jsonwebtoken';
import fetchuser from '../middleware/fetchuser.js';

// jwt.verify's callback is async, so the middleware outcome is wrapped in a promise
const runFetchuser = (token) =>
	new Promise((resolve) => {
		const req = { header: (name) => (name === 'auth-token' ? token : undefined) };
		const res = {
			status(code) {
				this.statusCode = code;
				return this;
			},
			send(body) {
				resolve({ req, statusCode: this.statusCode, body, nextCalled: false });
			},
		};
		fetchuser(req, res, () => resolve({ req, nextCalled: true }));
	});

describe('fetchuser', () => {
	const user = { id: '507f191e810c19729de860ea', name: 'Test User' };

	it('decodes a valid token onto req.user and calls next', async () => {
		const token = jwt.sign({ user }, process.env.JWT_SECRET_KEY, { algorithm: 'HS256' });
		const result = await runFetchuser(token);
		expect(result.nextCalled).toBe(true);
		expect(result.req.user).toEqual(user);
	});

	it('rejects a missing token with 401', async () => {
		const result = await runFetchuser(undefined);
		expect(result.statusCode).toBe(401);
		expect(result.body.success).toBe(false);
	});

	it('rejects a token signed with the wrong secret', async () => {
		const token = jwt.sign({ user }, 'some-other-secret', { algorithm: 'HS256' });
		const result = await runFetchuser(token);
		expect(result.statusCode).toBe(401);
	});

	it('rejects a garbage token', async () => {
		const result = await runFetchuser('not-a-jwt');
		expect(result.statusCode).toBe(401);
	});

	it('rejects an expired token', async () => {
		const token = jwt.sign({ user }, process.env.JWT_SECRET_KEY, { algorithm: 'HS256', expiresIn: -10 });
		const result = await runFetchuser(token);
		expect(result.statusCode).toBe(401);
	});
});
