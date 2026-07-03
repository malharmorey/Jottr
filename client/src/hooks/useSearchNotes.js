import { useInfiniteQuery, keepPreviousData } from '@tanstack/react-query';
import { searchNotes } from '../api/notes';
import useAuth from './useAuth';
import usePendingDeleteStore from '../stores/pendingDeleteStore';

// title matches for q, newest first, paged like the main list; idle while q is empty
export const useSearchNotes = (q) => {
	const { token, isLoggedIn } = useAuth();
	const pendingIds = usePendingDeleteStore((state) => state.ids);

	return useInfiniteQuery({
		queryKey: ['notes', 'search', q],
		queryFn: ({ pageParam }) => searchNotes(token, q, pageParam),
		initialPageParam: null,
		getNextPageParam: (lastPage) => lastPage.nextCursor,
		enabled: isLoggedIn && q.length > 0,
		select: (data) =>
			data.pages
				.flatMap((page) => page.notes)
				.filter((note) => !pendingIds.includes(note._id)),
		placeholderData: keepPreviousData,
	});
};
