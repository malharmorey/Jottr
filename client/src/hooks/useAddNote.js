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

		onSuccess: (note) => {
			queryClient.setQueryData(['notes'], (old) =>
				old
					? {
							...old,
							pages: old.pages.map((page, index) =>
								index === 0 ? { ...page, notes: [note, ...page.notes] } : page
							),
					  }
					: old
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
