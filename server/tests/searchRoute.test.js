import request from 'supertest';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import app from '../app.js';
import Note from '../models/Note.js';
import { connectTestDb, clearTestDb, disconnectTestDb } from './db.js';

// searchLimiter allows 30 hits/min per file-level bucket — this suite stays well under
const ownerId = new mongoose.Types.ObjectId();
const strangerId = new mongoose.Types.ObjectId();

const tokenFor = (id, name = 'Search User') =>
	jwt.sign({ user: { id: id.toString(), name } }, process.env.JWT_SECRET_KEY, { algorithm: 'HS256' });

const ownerToken = tokenFor(ownerId);

const createNote = (title, description = 'Filler body', user = ownerId) =>
	Note.create({ user, title, description });

const search = (q, extra = {}) =>
	request(app).get('/api/notes/search').query({ q, ...extra }).set('auth-token', ownerToken);

beforeAll(connectTestDb);
afterAll(disconnectTestDb);
beforeEach(clearTestDb);

describe('GET /api/notes/search', () => {
	it('requires a token', async () => {
		const res = await request(app).get('/api/notes/search').query({ q: 'milk' });
		expect(res.status).toBe(401);
	});

	it('matches titles only, ignoring letter case', async () => {
		await createNote('MILK run');
		await createNote('Trip plan', 'Buy milk before leaving');
		const res = await search('milk');
		expect(res.status).toBe(200);
		expect(res.body.notes.map((n) => n.title)).toEqual(['MILK run']);
		expect(res.body.nextCursor).toBeNull();
	});

	it('returns matches newest first', async () => {
		await createNote('Milk one');
		await createNote('Bread list');
		await createNote('Milk two');
		const res = await search('milk');
		expect(res.body.notes.map((n) => n.title)).toEqual(['Milk two', 'Milk one']);
	});

	it('pages matches with the cursor, no overlap and no gap', async () => {
		for (let i = 1; i <= 5; i++) await createNote(`Milk ${i}`);
		await createNote('Bread list');

		const first = await search('milk', { limit: 2 });
		expect(first.body.notes).toHaveLength(2);
		const second = await search('milk', { limit: 2, cursor: first.body.nextCursor });
		const third = await search('milk', { limit: 2, cursor: second.body.nextCursor });

		const titles = [...first.body.notes, ...second.body.notes, ...third.body.notes].map(
			(n) => n.title
		);
		expect(titles).toEqual(['Milk 5', 'Milk 4', 'Milk 3', 'Milk 2', 'Milk 1']);
		expect(third.body.nextCursor).toBeNull();
	});

	it('treats regex characters as plain text', async () => {
		await createNote('Budget (2026)');
		expect((await search('(2026)')).body.notes).toHaveLength(1);
		expect((await search('.*')).body.notes).toHaveLength(0);
	});

	it('never returns another user\'s notes', async () => {
		await createNote('Their milk note', 'Filler body', strangerId);
		const res = await search('milk');
		expect(res.body.notes).toHaveLength(0);
	});

	it('rejects an empty or whitespace query', async () => {
		expect((await search('')).status).toBe(400);
		expect((await search('   ')).status).toBe(400);
	});

	it('rejects a query over 100 characters', async () => {
		expect((await search('m'.repeat(101))).status).toBe(400);
	});

	it('rejects a malformed cursor', async () => {
		expect((await search('milk', { cursor: 'not-an-id' })).status).toBe(400);
	});
});
