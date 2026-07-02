import request from 'supertest';
import bcrypt from 'bcryptjs';
import app from '../app.js';
import User from '../models/User.js';
import { connectTestDb, disconnectTestDb } from './db.js';

beforeAll(connectTestDb);
afterAll(disconnectTestDb);

describe('auth rate limits', () => {
	it('blocks the 6th login attempt after 5 failures, even with the right password', async () => {
		const hash = await bcrypt.hash('Correct@123', 10);
		await User.create({ name: 'Limit User', email: 'limit@jottr.app', password: hash });

		for (let i = 0; i < 5; i++) {
			const res = await request(app)
				.post('/api/auth/login')
				.send({ email: 'limit@jottr.app', password: 'Wrong@123' });
			expect(res.status).toBe(400);
		}

		const blocked = await request(app)
			.post('/api/auth/login')
			.send({ email: 'limit@jottr.app', password: 'Correct@123' });
		expect(blocked.status).toBe(429);
		expect(blocked.body.message).toMatch(/try again in 15 minutes/);
	});

	it('blocks the 6th successful signup of the day', async () => {
		for (let i = 0; i < 5; i++) {
			const res = await request(app)
				.post('/api/auth/createUser')
				.send({ name: 'Signup User', email: `many${i}@jottr.app`, password: 'Sup3r@secret' });
			expect(res.status).toBe(200);
		}

		const blocked = await request(app)
			.post('/api/auth/createUser')
			.send({ name: 'Signup User', email: 'many5@jottr.app', password: 'Sup3r@secret' });
		expect(blocked.status).toBe(429);
		expect(blocked.body.message).toMatch(/Daily signup limit/);
	});
});
