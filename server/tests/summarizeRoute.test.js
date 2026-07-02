import request from 'supertest';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

// The AI helper is mocked for the WHOLE file — no test ever reaches Anthropic.
vi.mock('../lib/summarize.js', () => ({ default: vi.fn() }));

import summarizeNote from '../lib/summarize.js';
import app from '../app.js';
import Note from '../models/Note.js';
import { connectTestDb, clearTestDb, disconnectTestDb } from './db.js';

// Budget: the route's own flood limiter allows 20 requests / 15 min per IP and
// its bucket does NOT reset between tests — this file makes 17. Mind additions.

const ownerId = new mongoose.Types.ObjectId();
const strangerId = new mongoose.Types.ObjectId();
const token = jwt.sign({ user: { id: ownerId.toString(), name: 'Owner' } }, process.env.JWT_SECRET_KEY, {
	algorithm: 'HS256',
});

const createNote = (user = ownerId) =>
	Note.create({ user, title: 'Trip plan', description: 'Pack bags and book the tickets' });

const summarize = (id) => request(app).post(`/api/notes/summarize/${id}`).set('auth-token', token);

beforeAll(connectTestDb);
afterAll(disconnectTestDb);
beforeEach(async () => {
	await clearTestDb();
	summarizeNote.mockReset();
});

describe('POST /api/notes/summarize/:id', () => {
	it('returns the AI summary for your own note', async () => {
		summarizeNote.mockResolvedValue('A short summary');
		const note = await createNote();
		const res = await summarize(note.id);
		expect(res.status).toBe(200);
		expect(res.body.summary).toBe('A short summary');
		expect(summarizeNote).toHaveBeenCalledTimes(1);
	});

	it('404s an unknown note id without calling the AI', async () => {
		const res = await summarize(new mongoose.Types.ObjectId().toString());
		expect(res.status).toBe(404);
		expect(summarizeNote).not.toHaveBeenCalled();
	});

	it('404s someone else\'s note the same way — no existence leak', async () => {
		const note = await createNote(strangerId);
		const res = await summarize(note.id);
		expect(res.status).toBe(404);
		expect(res.body.message).toBe('Note not found');
		expect(summarizeNote).not.toHaveBeenCalled();
	});

	it('stops at the 5th summary of the day', async () => {
		summarizeNote.mockResolvedValue('S');
		const note = await createNote();
		for (let i = 0; i < 5; i++) {
			expect((await summarize(note.id)).status).toBe(200);
		}
		const blocked = await summarize(note.id);
		expect(blocked.status).toBe(429);
		expect(blocked.body.message).toMatch(/Daily summary limit/);
	});

	it('refunds the quota ticket when the AI call fails', async () => {
		const note = await createNote();
		const busy = Object.assign(new Error('upstream 529'), {
			userMessage: 'The AI service is busy right now, please try again in a minute',
			statusCode: 503,
		});
		summarizeNote.mockRejectedValueOnce(busy);
		const failed = await summarize(note.id);
		expect(failed.status).toBe(503);
		expect(failed.body.message).toMatch(/AI service is busy/);

		// the failed attempt was refunded, so five full summaries still fit today
		summarizeNote.mockResolvedValue('S');
		for (let i = 0; i < 5; i++) {
			expect((await summarize(note.id)).status).toBe(200);
		}
		expect((await summarize(note.id)).status).toBe(429);
	});

	it('maps an unexpected AI failure to a generic 502', async () => {
		summarizeNote.mockRejectedValue(new Error('boom'));
		const note = await createNote();
		const res = await summarize(note.id);
		expect(res.status).toBe(502);
		expect(res.body.message).toBe('Could not generate a summary, please try again');
	});
});
