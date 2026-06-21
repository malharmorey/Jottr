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

SummaryUsageSchema.index({ user: 1, day: 1 }, { unique: true });
SummaryUsageSchema.index({ createdAt: 1 }, { expireAfterSeconds: 172800 });

const SummaryUsage = mongoose.model('summaryUsage', SummaryUsageSchema);
export default SummaryUsage;
