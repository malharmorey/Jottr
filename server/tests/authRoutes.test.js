import request from 'supertest';
import bcrypt from 'bcryptjs';
import app from '../app.js';
import User from '../models/User.js';
import { connectTestDb, clearTestDb, disconnectTestDb } from './db.js';

const signup = (overrides = {}) =>
	request(app)
		.post('/api/auth/createUser')
		.send({ name: 'Test User', email: 'test@jottr.app', password: 'Sup3r@secret', ...overrides });

const login = (email, password) => request(app).post('/api/auth/login').send({ email, password });

const createUserDirectly = async (email, password = 'Sup3r@secret') => {
	const hash = await bcrypt.hash(password, 10);
	return User.create({ name: 'Direct User', email, password: hash });
};

beforeAll(connectTestDb);
afterAll(disconnectTestDb);
beforeEach(clearTestDb);

describe('POST /api/auth/createUser', () => {
	it('signs up a new user and returns an auth token', async () => {
		const res = await signup();
		expect(res.status).toBe(200);
		expect(res.body.success).toBe(true);
		expect(res.body.authToken).toBeDefined();
	});

	it('refuses a duplicate email', async () => {
		await signup();
		const res = await signup();
		expect(res.status).toBe(400);
		expect(res.body.message).toMatch(/already in use/i);
	});

	it('rejects a weak password with the validator message', async () => {
		const res = await signup({ password: 'weakpass' });
		expect(res.status).toBe(400);
		expect(res.body.errors.some((e) => /1 lowerCase, 1 upperCase/.test(e.msg))).toBe(true);
	});

	it('rejects an invalid email', async () => {
		const res = await signup({ email: 'not-an-email' });
		expect(res.status).toBe(400);
		expect(res.body.errors.some((e) => e.msg === 'Enter a valid email')).toBe(true);
	});

	it('rejects a password over 72 bytes', async () => {
		const res = await signup({ password: 'Aa1@' + 'x'.repeat(70) });
		expect(res.status).toBe(400);
		expect(res.body.message).toMatch(/72 characters or fewer/);
	});

	it('surfaces a mongoose maxlength failure as a readable 400', async () => {
		const res = await signup({ name: 'N'.repeat(60) });
		expect(res.status).toBe(400);
		expect(res.body.message).toBe('name is too long');
	});
});

describe('POST /api/auth/login', () => {
	it('logs in with correct credentials', async () => {
		await createUserDirectly('login@jottr.app');
		const res = await login('login@jottr.app', 'Sup3r@secret');
		expect(res.status).toBe(200);
		expect(res.body.authToken).toBeDefined();
	});

	it('rejects a wrong password', async () => {
		await createUserDirectly('wrongpw@jottr.app');
		const res = await login('wrongpw@jottr.app', 'Wrong@secret1');
		expect(res.status).toBe(400);
		expect(res.body.message).toBe('Incorrect password');
	});

	it('rejects an unknown email', async () => {
		const res = await login('nobody@jottr.app', 'Sup3r@secret');
		expect(res.status).toBe(400);
		expect(res.body.message).toMatch(/couldn't find an account/);
	});

	it('rejects a login without a password', async () => {
		const res = await request(app).post('/api/auth/login').send({ email: 'login@jottr.app' });
		expect(res.status).toBe(400);
		expect(res.body.errors.some((e) => e.msg === 'Password can not be blank')).toBe(true);
	});
});
