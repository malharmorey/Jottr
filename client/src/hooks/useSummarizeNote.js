import { useQuery } from '@tanstack/react-query';
import { summarizeNote } from '../api/notes';
import useAuth from './useAuth';

// fetch + cache a note's AI summary; one request per note, reused on reopen
export const useSummarizeNote = (noteId) => {
	const { token } = useAuth();
	return useQuery({
		queryKey: ['summary', noteId],
		queryFn: () => summarizeNote(token, noteId),
		enabled: Boolean(noteId),
		staleTime: Infinity,
		gcTime: Infinity,
		retry: false,
		// errors surface in the summary modal, not the global toast
		meta: { skipGlobalError: true },
	});
};
