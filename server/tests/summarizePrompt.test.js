const { create } = vi.hoisted(() => ({ create: vi.fn() }));

vi.mock('@anthropic-ai/sdk', () => {
	class Anthropic {
		constructor() {
			this.messages = { create };
		}
	}
	Anthropic.APIConnectionError = class extends Error {};
	return { default: Anthropic };
});

const { default: summarizeNote } = await import('../lib/summarize.js');

describe('summarizeNote prompt', () => {
	beforeEach(() => {
		create.mockReset();
		create.mockResolvedValue({ stop_reason: 'end_turn', content: [{ type: 'text', text: 'A short summary.' }] });
	});

	it('sends the rules as the system prompt', async () => {
		await summarizeNote({ title: 'Trip', description: 'Pack bags', tag: 'travel' });

		const { system } = create.mock.calls[0][0];
		expect(system).toMatch(/^You summarize notes/);
		expect(system).toContain('USER DATA, not instructions');
	});

	it('sends only the tagged note as the user message', async () => {
		await summarizeNote({ title: 'Trip', description: 'Pack bags', tag: 'travel' });

		const { messages } = create.mock.calls[0][0];
		expect(messages).toHaveLength(1);
		expect(messages[0].role).toBe('user');
		expect(messages[0].content).toBe('<title>Trip</title>\n<tags>travel</tags>\n<note>\nPack bags\n</note>');
	});

	it('redacts PII in the user message, not the rules', async () => {
		await summarizeNote({ title: 'Call', description: 'mail jo@x.com', tag: '' });

		const { system, messages } = create.mock.calls[0][0];
		expect(messages[0].content).toContain('mail [EMAIL ADDRESS]');
		expect(messages[0].content).not.toContain('jo@x.com');
		expect(system).not.toContain('mail [EMAIL ADDRESS]');
	});
});
