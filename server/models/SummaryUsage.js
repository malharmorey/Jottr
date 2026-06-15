import mongoose from 'mongoose';
const { Schema } = mongoose;

const SummaryUsageSchema = new Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'user',
		required: true,
	},
	day: {
		type: String,
		required: true,
	},
	count: {
		type: Number,
		default: 0,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

// One usage doc per user per UTC day — also makes the at-cap upsert collide (E11000).
SummaryUsageSchema.index({ user: 1, day: 1 }, { unique: true });
// Auto-expire day records ~2 days after creation so the collection self-cleans.
SummaryUsageSchema.index({ createdAt: 1 }, { expireAfterSeconds: 172800 });

const SummaryUsage = mongoose.model('summaryUsage', SummaryUsageSchema);
export default SummaryUsage;
