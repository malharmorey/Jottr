import { useQueryClient } from '@tanstack/react-query';
import { deleteNote } from '../api/notes';
import useAuth from './useAuth';
import useAlertStore from '../stores/alertStore';

const UNDO_WINDOW_MS = 10000;

let pending = null;

export const useDeleteNote = () => {
	const { token } = useAuth();
	const queryClient = useQueryClient();

	// send the real DELETE; bring the note back and report if it fails
	const commit = (task) => {
		deleteNote(task.token, task.id)
			.catch((error) => {
				queryClient.setQueryData(['notes'], task.previous);
				useAlertStore.getState().showAlert(error.message, 'danger');
			})
			.finally(() => {
				queryClient.invalidateQueries({ queryKey: ['notes'] });
			});
	};

	const undo = (task) => {
		clearTimeout(task.timer);
		if (pending === task) pending = null;
		queryClient.setQueryData(['notes'], task.previous);
		queryClient.invalidateQueries({ queryKey: ['notes'] });
		useAlertStore.getState().dismissAlert();
	};

	const requestDelete = async (id) => {
		// only one undo at a time: finalise any delete still counting down
		if (pending) {
			clearTimeout(pending.timer);
			commit(pending);
			pending = null;
		}

		await queryClient.cancelQueries({ queryKey: ['notes'] });
		const previous = queryClient.getQueryData(['notes']);
		queryClient.setQueryData(['notes'], (old) =>
			old ? { ...old, notes: old.notes.filter((note) => note._id !== id) } : old
		);

		const task = { id, token, previous };
		task.timer = setTimeout(() => {
			if (pending === task) pending = null;
			useAlertStore.getState().dismissAlert();
			commit(task);
		}, UNDO_WINDOW_MS);
		pending = task;

		useAlertStore.getState().showUndoAlert('Note deleted', () => undo(task));
	};

	return { requestDelete };
};