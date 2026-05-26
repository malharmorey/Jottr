import { useQuery } from '@tanstack/react-query';
import { getAllNotes } from '../api/notes';
import useAuth from './useAuth';

const useNotesQuery = (select) => {
	const { token, isLoggedIn } = useAuth();
	return useQuery({
		queryKey: ['notes'],
		queryFn: () => getAllNotes(token),
		enabled: isLoggedIn,
		select,
	});
};

// notes of the current user, newest first
export const useNotes = () => useNotesQuery((data) => [...data.notes].reverse());
