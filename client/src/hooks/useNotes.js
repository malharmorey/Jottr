import { useQuery } from '@tanstack/react-query';
import { getAllNotes } from '../api/notes';
import useAuth from './useAuth';
import usePendingDeleteStore from '../stores/pendingDeleteStore';

const useNotesQuery = (select) => {
	const { token, isLoggedIn } = useAuth();
	return useQuery({
		queryKey: ['notes'],
		queryFn: () => getAllNotes(token),
		enabled: isLoggedIn,
		select,
	});
};

// notes of the current user, newest first, minus any awaiting undo
export const useNotes = () => {
	const pendingIds = usePendingDeleteStore((state) => state.ids);
	return useNotesQuery((data) =>
		[...data.notes].reverse().filter((note) => !pendingIds.includes(note._id))
	);
};
