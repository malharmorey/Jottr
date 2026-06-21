import { act, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import AiSummaryModal from '../Components/AiSummaryModal';
import AlertToaster from '../Components/AlertToaster';
import useAiSummaryStore from '../stores/aiSummaryStore';
import { writeSummary } from '../lib/summaryCache';
import { renderWithProviders, login } from './renderWithProviders';
import { mockFetch } from './mockFetch';

const openSummary = (noteId = 'n1') =>
	act(() => useAiSummaryStore.getState().open(noteId));

describe('AiSummaryModal', () => {
	it('fetches and shows the summary, caching it in sessionStorage', async () => {
		login('Alice');
		mockFetch({ success: true, summary: 'Milk, eggs and a reminder.' });
		renderWithProviders(<AiSummaryModal />);
		openSummary('n1');

		expect(
			await screen.findByText('Milk, eggs and a reminder.')
		).toBeInTheDocument();
		const cached = JSON.parse(sessionStorage.getItem('summaries'));
		expect(cached.n1).toBe('Milk, eggs and a reminder.');
	});

	it('reads a cached summary without calling the API', async () => {
		login('Alice');
		writeSummary('n1', 'A previously cached summary');
		const fetchSpy = mockFetch({ success: true, summary: 'should not be used' });
		renderWithProviders(<AiSummaryModal />);
		openSummary('n1');

		expect(
			await screen.findByText('A previously cached summary')
		).toBeInTheDocument();
		expect(fetchSpy).not.toHaveBeenCalled();
	});

	it('shows the error message when the summary fails', async () => {
		login('Alice');
		mockFetch(
			{ success: false, message: 'Could not generate a summary, please try again' },
			false
		);
		renderWithProviders(<AiSummaryModal />);
		openSummary('n1');

		expect(
			await screen.findByText(/could not generate a summary/i)
		).toBeInTheDocument();
	});

	it('retries after a failure and then shows the summary', async () => {
		login('Alice');
		global.fetch = vi
			.fn()
			.mockResolvedValueOnce({
				ok: false,
				json: async () => ({ success: false, message: 'Temporary failure' }),
			})
			.mockResolvedValueOnce({
				ok: true,
				json: async () => ({ success: true, summary: 'A fresh summary' }),
			});
		const user = userEvent.setup();
		renderWithProviders(<AiSummaryModal />);
		openSummary('n1');

		await screen.findByText(/temporary failure/i);
		await user.click(screen.getByRole('button', { name: /retry/i }));
		expect(await screen.findByText('A fresh summary')).toBeInTheDocument();
	});

	it('copies the summary to the clipboard', async () => {
		login('Alice');
		mockFetch({ success: true, summary: 'Copy me' });
		const user = userEvent.setup();
		// override AFTER setup() — user-event installs its own clipboard stub
		const writeText = vi.fn().mockResolvedValue();
		Object.defineProperty(navigator, 'clipboard', {
			value: { writeText },
			configurable: true,
		});
		renderWithProviders(
			<>
				<AlertToaster />
				<AiSummaryModal />
			</>
		);
		openSummary('n1');

		await screen.findByText('Copy me');
		await user.click(screen.getByRole('button', { name: /copy/i }));
		await waitFor(() => expect(writeText).toHaveBeenCalledWith('Copy me'));
	});
});
