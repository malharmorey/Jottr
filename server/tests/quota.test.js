import mongoose from 'mongoose';
import SummaryUsage from '../models/SummaryUsage.js';
import { reserveSummary, refundSummary, DAILY_LIMIT } from '../lib/quota.js';
import { connectTestDb, clearTestDb, disconnectTestDb } from './db.js';

const userId = new mongoose.Types.ObjectId();

beforeAll(connectTestDb);
afterAll(disconnectTestDb);
beforeEach(clearTestDb);

describe('summary quota', () => {
	it('grants up to the daily limit and then refuses', async () => {
		for (let i = 0; i < DAILY_LIMIT; i++) {
			expect(await reserveSummary(userId)).toBe(true);
		}
		expect(await reserveSummary(userId)).toBe(false);
	});

	it('frees one slot again after a refund', async () => {
		for (let i = 0; i < DAILY_LIMIT; i++) await reserveSummary(userId);
		await refundSummary(userId);
		expect(await reserveSummary(userId)).toBe(true);
		expect(await reserveSummary(userId)).toBe(false);
	});

	it('tracks users independently', async () => {
		for (let i = 0; i < DAILY_LIMIT; i++) await reserveSummary(userId);
		expect(await reserveSummary(new mongoose.Types.ObjectId())).toBe(true);
	});

	it('a refund with no usage never creates a negative ticket', async () => {
		await refundSummary(userId);
		expect(await SummaryUsage.findOne({ user: userId })).toBeNull();
	});
});
