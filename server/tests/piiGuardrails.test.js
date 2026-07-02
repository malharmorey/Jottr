import { redactPII, scrubLabels } from '../lib/summarize.js';

describe('redactPII', () => {
	it('redacts email addresses', () => {
		expect(redactPII('reach me at jo.doe+work@mail.co.in today')).toBe('reach me at [EMAIL ADDRESS] today');
	});

	it('redacts SSNs', () => {
		expect(redactPII('ssn 123-45-6789 on file')).toBe('ssn [SSN] on file');
	});

	it('redacts Luhn-valid card numbers', () => {
		expect(redactPII('paid with 4111 1111 1111 1111 yesterday')).toBe('paid with [CARD NUMBER] yesterday');
	});

	it('leaves a Luhn-invalid digit run alone', () => {
		expect(redactPII('tracking 4111 1111 1111 1112 shipped')).toBe('tracking 4111 1111 1111 1112 shipped');
	});

	it('redacts phone numbers', () => {
		expect(redactPII('call +91 98765 43210 now')).toBe('call [PHONE NUMBER] now');
	});

	it('redacts long bare digit runs as numbers, not phones', () => {
		expect(redactPII('order 987654321 confirmed')).toBe('order [NUMBER] confirmed');
	});

	it('handles multiple PII types in one note', () => {
		expect(redactPII('a@b.com or 123-45-6789')).toBe('[EMAIL ADDRESS] or [SSN]');
	});

	it('returns plain text untouched', () => {
		expect(redactPII('groceries: milk, eggs and bread')).toBe('groceries: milk, eggs and bread');
	});

	it('defaults to an empty string', () => {
		expect(redactPII()).toBe('');
	});
});

describe('scrubLabels', () => {
	it('rewrites redaction tokens to plain words', () => {
		expect(scrubLabels('sent to [EMAIL ADDRESS] and [PHONE NUMBER]')).toBe('sent to an email address and a phone number');
	});

	it('covers the card, ssn and number tokens', () => {
		expect(scrubLabels('[CARD NUMBER] [SSN] [NUMBER]')).toBe('a card number an SSN a number');
	});

	it('leaves ordinary brackets alone', () => {
		expect(scrubLabels('todo [urgent] call mom')).toBe('todo [urgent] call mom');
	});
});
