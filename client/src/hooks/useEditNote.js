import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateNote } from '../api/notes';
import { removeSummary } from '../lib/summaryCache';
import useAuth from './useAuth';
import useAlertStore from '../stores/alertStore';

// edit a note, optimistically updating it and rolling back on error
export const useEditNote = () => {
	const { token } = useAuth();
	const queryClient = useQueryClient();
	const showAlert = useAlertStore.getState().showAlert;

	return useMutation({
		mutationFn: ({ id, title, description, tag }) =>
			updateNote(token, id, { title, description, tag }),
		onMutate: async ({ id, title, description, tag }) => {
			await queryClient.cancelQueries({ queryKey: ['notes'] });
			const previous = queryClient.getQueryData(['notes']);
			queryClient.setQueryData(['notes'], (old) =>
				old
					? {
							...old,
							pages: old.pages.map((page) => ({
								...page,
								notes: page.notes.map((note) =>
									note._id === id
										? { ...note, title, description, tag, date: Date.now() }
										: note
								),
							})),
					  }
					: old
			);
			return { previous };
		},
		onError: (error, _vars, context) => {
			queryClient.setQueryData(['notes'], context?.previous);
			showAlert(error.message, 'danger');
		},
		onSuccess: (_data, { id }) => {
			showAlert('Note updated', 'success');
			// drop the stale summary so the next open regenerates it
			queryClient.removeQueries({ queryKey: ['summary', id] });
			removeSummary(id);
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ['notes'] });
		},
	});
};