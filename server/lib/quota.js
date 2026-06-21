import SummaryUsage from '../models/SummaryUsage.js';

const DAILY_LIMIT = 5;

// UTC day string, e.g. '2026-06-14'
const utcDay = () => new Date().toISOString().slice(0, 10);

const reserveSummary = async (userId) => {
	try {
		const doc = await SummaryUsage.findOneAndUpdate(
			{ user: userId, day: utcDay(), count: { $lt: DAILY_LIMIT } },
			{ $inc: { count: 1 } },
			{ new: true, upsert: true }
		);
		return doc !== null;
	} catch (err) {
		if (err.code === 11000) return false;
		throw err;
	}
};

const refundSummary = (userId) =>
	SummaryUsage.updateOne(
		{ user: userId, day: utcDay(), count: { $gt: 0 } },
		{ $inc: { count: -1 } }
	);

export { reserveSummary, refundSummary, DAILY_LIMIT };
