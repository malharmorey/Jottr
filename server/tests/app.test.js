import request from 'supertest';
import app from '../app.js';

// App-shell behaviors that live outside the routers, no DB needed.

describe('app shell', () => {
	it('answers the health-check root route', async () => {
		const res = await request(app).get('/');
		expect(res.status).toBe(200);
		expect(res.text).toBe('Welcome to server!');
	});

	it('rejects a body over the 18kb limit with a clean 413', async () => {
		const res = await request(app)
			.post('/api/auth/login')
			.set('Content-Type', 'application/json')
			.send({ email: 'a@b.com', password: 'x'.repeat(19000) });
		expect(res.status).toBe(413);
		expect(res.body.message).toBe('Request too large');
	});
});
