import { useQuery } from '@tanstack/react-query';
import { summarizeNote } from '../api/notes';
import { readSummary, writeSummary } from '../lib/summaryCache';
import useAuth from './useAuth';

export const useSummarizeNote = (noteId) => {
	const { token } = useAuth();
	return useQuery({
		queryKey: ['summary', noteId],
		queryFn: async () => {
			const summary = await summarizeNote(token, noteId);
			writeSummary(noteId, summary);
			return summary;
		},
		enabled: Boolean(noteId),
		initialData: () => readSummary(noteId),
		staleTime: Infinity,
		gcTime: Infinity,
		retry: false,
		meta: { skipGlobalError: true },
	});
};
