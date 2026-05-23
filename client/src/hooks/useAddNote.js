import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addNote } from '../api/notes';
import useAuth from './useAuth';
import useAlertStore from '../stores/alertStore';

// add a note, optimistically inserting it and rolling back on error
export const useAddNote = () => {
	const { token } = useAuth();
	const queryClient = useQueryClient();
	const showAlert = useAlertStore.getState().showAlert;

	return useMutation({
		mutationFn: (newNote) => addNote(token, newNote),
		onMutate: async (newNote) => {
			await queryClient.cancelQueries({ queryKey: ['notes'] });
			const previous = queryClient.getQueryData(['notes']);
			const optimistic = { _id: `temp-${Date.now()}`, date: Date.now(), ...newNote };
			queryClient.setQueryData(['notes'], (old) =>
				old ? { ...old, notes: [...old.notes, optimistic] } : old
			);
			return { previous };
		},
		onError: (error, _newNote, context) => {
			queryClient.setQueryData(['notes'], context?.previous);
			showAlert(error.message, 'danger');
		},
		onSuccess: () => {
			showAlert('Your note has been added successfully', 'success');
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ['notes'] });
		},
	});
};