import { vi } from 'vitest';

export const mockFetchOnce = (body, ok = true) =>
	vi.spyOn(global, 'fetch').mockResolvedValueOnce({
		ok,
		json: async () => body,
	});

export const mockFetch = (body, ok = true) =>
	vi.spyOn(global, 'fetch').mockResolvedValue({
		ok,
		json: async () => body,
	});

// A thrown fetch (network down) — the wrapper turns this into its fallback message.
export const mockFetchReject = () =>
	vi.spyOn(global, 'fetch').mockRejectedValue(new TypeError('Failed to fetch'));
