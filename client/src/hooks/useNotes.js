import { useInfiniteQuery } from '@tanstack/react-query';
import { getNotes } from '../api/notes';
import useAuth from './useAuth';
import usePendingDeleteStore from '../stores/pendingDeleteStore';

const useNotesQuery = (select) => {
	const { token, isLoggedIn } = useAuth();
	return useInfiniteQuery({
		queryKey: ['notes'],
		queryFn: ({ pageParam }) => getNotes(token, pageParam),
		initialPageParam: null,
		getNextPageParam: (lastPage) => lastPage.nextCursor,
		enabled: isLoggedIn,
		select,
		throwOnError: (error, query) => !query.state.data,
		meta: { skipGlobalError: true },
	});
};

// notes of the current user, newest first from the server, minus any awaiting undo
export const useNotes = () => {
	const pendingIds = usePendingDeleteStore((state) => state.ids);
	return useNotesQuery((data) =>
		data.pages
			.flatMap((page) => page.notes)
			.filter((note) => !pendingIds.includes(note._id))
	);
};
