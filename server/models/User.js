import mongoose from 'mongoose';
const { Schema } = mongoose;

const UserSchema = new Schema({
	name: {
		type: String,
		required: true,
		maxlength: 50,
	},
	email: {
		type: String,
		required: true,
		maxlength: 254,
	},
	password: {
		type: String,
		required: true,
	},
	date: {
		type: Date,
		default: Date.now,
	},
});
const User = mongoose.model('user', UserSchema);
export default User;
