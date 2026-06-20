import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addNote } from '../api/notes';
import useAuth from './useAuth';
import useAlertStore from '../stores/alertStore';

// add a note, inserting the server's note (with its real _id) on success
export const useAddNote = () => {
	const { token } = useAuth();
	const queryClient = useQueryClient();
	const showAlert = useAlertStore.getState().showAlert;

	return useMutation({
		mutationFn: (newNote) => addNote(token, newNote),
		// Insert the real note (real _id) so its list key is stable from the
		// first paint — no temp→real key swap, so the list reflow plays a single
		// clean enter instead of vanishing and re-entering on the refetch.
		onSuccess: (note) => {
			queryClient.setQueryData(['notes'], (old) =>
				old ? { ...old, notes: [...old.notes, note] } : old
			);
			showAlert('Note added', 'success');
		},
		onError: (error) => {
			showAlert(error.message, 'danger');
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ['notes'] });
		},
	});
};
