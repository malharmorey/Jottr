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

const createNote = (title, description, user = ownerId) =>
	Note.create({ user, title, description });

const search = (q) =>
	request(app).get('/api/notes/search').query({ q }).set('auth-token', ownerToken);

beforeAll(connectTestDb);
afterAll(disconnectTestDb);
beforeEach(clearTestDb);

describe('GET /api/notes/search', () => {
	it('requires a token', async () => {
		const res = await request(app).get('/api/notes/search').query({ q: 'milk' });
		expect(res.status).toBe(401);
	});

	it('matches in the title', async () => {
		await createNote('Grocery run', 'Eggs and bread');
		await createNote('Trip plan', 'Pack the bags');
		const res = await search('grocery');
		expect(res.status).toBe(200);
		expect(res.body.notes.map((n) => n.title)).toEqual(['Grocery run']);
	});

	it('matches in the description', async () => {
		await createNote('Trip plan', 'Buy milk before leaving');
		const res = await search('milk');
		expect(res.body.notes).toHaveLength(1);
	});

	it('ranks title matches above description-only matches', async () => {
		await createNote('Weekend list', 'Remember the milk');
		await createNote('Milk budget', 'Monthly dairy spend');
		await createNote('Older shopping', 'More milk for the cake');
		const res = await search('milk');
		expect(res.body.notes.map((n) => n.title)).toEqual([
			'Milk budget',
			'Older shopping',
			'Weekend list',
		]);
	});

	it('ignores letter case', async () => {
		await createNote('MILK note', 'Dairy things');
		const res = await search('milk');
		expect(res.body.notes).toHaveLength(1);
	});

	it('treats regex characters as plain text', async () => {
		await createNote('Budget (2026)', 'Yearly numbers');
		expect((await search('(2026)')).body.notes).toHaveLength(1);
		expect((await search('.*')).body.notes).toHaveLength(0);
	});

	it('never returns another user\'s notes', async () => {
		await createNote('Their milk note', 'Not yours', strangerId);
		const res = await search('milk');
		expect(res.body.notes).toHaveLength(0);
	});

	it('rejects an empty or whitespace query', async () => {
		expect((await search('')).status).toBe(400);
		expect((await search('   ')).status).toBe(400);
	});

	it('rejects a query over 100 characters', async () => {
		const res = await search('m'.repeat(101));
		expect(res.status).toBe(400);
	});

	it('caps results at 50', async () => {
		await Note.insertMany(
			Array.from({ length: 55 }, (_, i) => ({
				user: ownerId,
				title: `Milk note ${i}`,
				description: 'Filler body',
			}))
		);
		const res = await search('milk');
		expect(res.body.notes).toHaveLength(50);
	});
});
