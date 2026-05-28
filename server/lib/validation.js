import { validationResult } from 'express-validator';

export const validate = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ success: false, errors: errors.array() });
	}
	next();
};

export const formatMaxLengthError = (err) => {
	const fields = Object.keys(err.errors || {}).filter((f) => err.errors[f].kind === 'maxlength');
	if (!fields.length) return null;
	if (fields.length === 1) return `${fields[0]} is too long`;
	if (fields.length === 2) return `${fields[0]} and ${fields[1]} are too long`;
	const last = fields.pop();
	return `${fields.join(', ')} and ${last} are too long`;
};