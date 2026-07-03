import request from 'supertest';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import app from '../app.js';
import Note from '../models/Note.js';
import { connectTestDb, clearTestDb, disconnectTestDb } from './db.js';

// fetchuser only decodes the JWT (no DB lookup), so users are just signed ids —
// no signups needed, which also keeps the auth limiters out of this file.
const ownerId = new mongoose.Types.ObjectId();
const strangerId = new mongoose.Types.ObjectId();

const tokenFor = (id, name = 'Notes User') =>
	jwt.sign({ user: { id: id.toString(), name } }, process.env.JWT_SECRET_KEY, { algorithm: 'HS256' });

const ownerToken = tokenFor(ownerId);
const strangerToken = tokenFor(strangerId, 'Stranger');

const createNote = (user = ownerId, title = 'Trip plan') =>
	Note.create({ user, title, description: 'Pack bags and book the tickets' });

beforeAll(connectTestDb);
afterAll(disconnectTestDb);
beforeEach(clearTestDb);

describe('GET /api/notes/getallnotes', () => {
	it('requires a token', async () => {
		const res = await request(app).get('/api/notes/getallnotes');
		expect(res.status).toBe(401);
	});

	it('returns only the logged-in user\'s notes', async () => {
		await createNote(ownerId, 'Mine');
		await createNote(strangerId, 'Not mine');
		const res = await request(app).get('/api/notes/getallnotes').set('auth-token', ownerToken);
		expect(res.status).toBe(200);
		expect(res.body.notes).toHaveLength(1);
		expect(res.body.notes[0].title).toBe('Mine');
		expect(res.body.nextCursor).toBeNull();
	});

	it('returns notes newest first', async () => {
		await createNote(ownerId, 'First');
		await createNote(ownerId, 'Second');
		await createNote(ownerId, 'Third');
		const res = await request(app).get('/api/notes/getallnotes').set('auth-token', ownerToken);
		expect(res.body.notes.map((n) => n.title)).toEqual(['Third', 'Second', 'First']);
	});

	it('pages through with the cursor, no overlap and no gap', async () => {
		for (let i = 1; i <= 7; i++) await createNote(ownerId, `Note ${i}`);

		const seen = [];
		let cursor = null;
		let pages = 0;
		do {
			const url = `/api/notes/getallnotes?limit=3${cursor ? `&cursor=${cursor}` : ''}`;
			const res = await request(app).get(url).set('auth-token', ownerToken);
			expect(res.status).toBe(200);
			seen.push(...res.body.notes.map((n) => n.title));
			cursor = res.body.nextCursor;
			pages++;
		} while (cursor);

		expect(pages).toBe(3);
		expect(seen).toEqual(['Note 7', 'Note 6', 'Note 5', 'Note 4', 'Note 3', 'Note 2', 'Note 1']);
	});

	it('keeps other users\' notes out of every page', async () => {
		await createNote(ownerId, 'Mine 1');
		await createNote(strangerId, 'Not mine');
		await createNote(ownerId, 'Mine 2');
		const res = await request(app).get('/api/notes/getallnotes?limit=2').set('auth-token', ownerToken);
		expect(res.body.notes.map((n) => n.title)).toEqual(['Mine 2', 'Mine 1']);
	});

	it('caps the batch size at 50', async () => {
		await Note.insertMany(
			Array.from({ length: 55 }, (_, i) => ({
				user: ownerId,
				title: `Bulk ${i}`,
				description: 'Filler body for the cap test',
			}))
		);
		const res = await request(app).get('/api/notes/getallnotes?limit=999').set('auth-token', ownerToken);
		expect(res.body.notes).toHaveLength(50);
		expect(res.body.nextCursor).not.toBeNull();
	});

	it('falls back to the default batch on a garbage limit', async () => {
		await createNote(ownerId);
		const res = await request(app).get('/api/notes/getallnotes?limit=abc').set('auth-token', ownerToken);
		expect(res.status).toBe(200);
		expect(res.body.notes).toHaveLength(1);
	});

	it('rejects a malformed cursor', async () => {
		const res = await request(app)
			.get('/api/notes/getallnotes?cursor=not-an-id')
			.set('auth-token', ownerToken);
		expect(res.status).toBe(400);
	});
});

describe('POST /api/notes/addnote', () => {
	const addNote = (body) =>
		request(app).post('/api/notes/addnote').set('auth-token', ownerToken).send(body);

	it('creates a note with the default tag', async () => {
		const res = await addNote({ title: 'Groceries', description: 'Milk, eggs and bread' });
		expect(res.status).toBe(200);
		expect(res.body.note.tag).toBe('General');
		expect(await Note.countDocuments({ user: ownerId })).toBe(1);
	});

	it('rejects a too-short title', async () => {
		const res = await addNote({ title: 'ab', description: 'Milk, eggs and bread' });
		expect(res.status).toBe(400);
		expect(res.body.errors.some((e) => /at least 3 characters/.test(e.msg))).toBe(true);
	});

	it('rejects a blank description', async () => {
		const res = await addNote({ title: 'Groceries', description: '' });
		expect(res.status).toBe(400);
		expect(res.body.errors.some((e) => e.msg === 'Description can not be blank')).toBe(true);
	});

	it('surfaces a maxlength overflow as a readable 400', async () => {
		const res = await addNote({ title: 'T'.repeat(201), description: 'Milk, eggs and bread' });
		expect(res.status).toBe(400);
		expect(res.body.message).toBe('title is too long');
	});
});

describe('PUT /api/notes/updatenote/:id', () => {
	const updateNote = (id, token, body = { title: 'New title', description: 'New description text', tag: 'Travel' }) =>
		request(app).put(`/api/notes/updatenote/${id}`).set('auth-token', token).send(body);

	it('updates your own note', async () => {
		const note = await createNote();
		const res = await updateNote(note.id, ownerToken);
		expect(res.status).toBe(200);
		expect((await Note.findById(note.id)).title).toBe('New title');
	});

	it('refuses to touch someone else\'s note', async () => {
		const note = await createNote(strangerId);
		const res = await updateNote(note.id, ownerToken);
		expect(res.status).toBe(401);
		expect((await Note.findById(note.id)).title).toBe('Trip plan');
	});

	it('404s an unknown note id', async () => {
		const res = await updateNote(new mongoose.Types.ObjectId().toString(), ownerToken);
		expect(res.status).toBe(404);
	});
});

describe('DELETE /api/notes/deletenote/:id', () => {
	const deleteNote = (id, token) =>
		request(app).delete(`/api/notes/deletenote/${id}`).set('auth-token', token);

	it('deletes your own note', async () => {
		const note = await createNote();
		const res = await deleteNote(note.id, ownerToken);
		expect(res.status).toBe(200);
		expect(await Note.findById(note.id)).toBeNull();
	});

	it('refuses to delete someone else\'s note', async () => {
		const note = await createNote(ownerId);
		const res = await deleteNote(note.id, strangerToken);
		expect(res.status).toBe(401);
		expect(await Note.findById(note.id)).not.toBeNull();
	});

	it('404s an unknown note id', async () => {
		const res = await deleteNote(new mongoose.Types.ObjectId().toString(), ownerToken);
		expect(res.status).toBe(404);
	});
});
