import { formatMaxLengthError } from '../lib/validation.js';

const maxlengthError = (...fields) => ({
	errors: Object.fromEntries(fields.map((field) => [field, { kind: 'maxlength' }])),
});

describe('formatMaxLengthError', () => {
	it('returns null when nothing exceeded maxlength', () => {
		expect(formatMaxLengthError({ errors: { title: { kind: 'required' } } })).toBeNull();
		expect(formatMaxLengthError({})).toBeNull();
	});

	it('names a single field', () => {
		expect(formatMaxLengthError(maxlengthError('title'))).toBe('title is too long');
	});

	it('joins two fields with and', () => {
		expect(formatMaxLengthError(maxlengthError('title', 'description'))).toBe('title and description are too long');
	});

	it('lists three fields with commas', () => {
		expect(formatMaxLengthError(maxlengthError('title', 'description', 'tag'))).toBe('title, description and tag are too long');
	});

	it('ignores non-maxlength errors mixed in', () => {
		expect(
			formatMaxLengthError({ errors: { title: { kind: 'maxlength' }, description: { kind: 'required' } } })
		).toBe('title is too long');
	});
});
