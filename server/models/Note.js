import mongoose from 'mongoose';
const { Schema } = mongoose;

const NotesSchema = new Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'user',
	},
	title: {
		type: String,
		required: true,
		maxlength: 200,
	},
	description: {
		type: String,
		required: true,
		maxlength: 10000,
	},
	tag: {
		type: String,
		default: 'General',
		maxlength: 60,
	},
	date: {
		type: Date,
		default: Date.now,
	},
});

NotesSchema.index({ user: 1, _id: -1 });

const Note = mongoose.model('note', NotesSchema);
export default Note;
