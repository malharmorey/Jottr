import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteNote } from '../api/notes';
import useAuth from './useAuth';
import useAlertStore from '../stores/alertStore';

// delete a note, optimistically removing it and rolling back on error
export const useDeleteNote = () => {
	const { token } = useAuth();
	const queryClient = useQueryClient();
	const showAlert = useAlertStore.getState().showAlert;

	return useMutation({
		mutationFn: (id) => deleteNote(token, id),
		onMutate: async (id) => {
			await queryClient.cancelQueries({ queryKey: ['notes'] });
			const previous = queryClient.getQueryData(['notes']);
			queryClient.setQueryData(['notes'], (old) =>
				old
					? { ...old, notes: old.notes.filter((note) => note._id !== id) }
					: old
			);
			return { previous };
		},
		onError: (error, _id, context) => {
			queryClient.setQueryData(['notes'], context?.previous);
			showAlert(error.message, 'danger');
		},
		onSuccess: () => {
			showAlert('Your note has been deleted successfully', 'danger');
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ['notes'] });
		},
	});
};