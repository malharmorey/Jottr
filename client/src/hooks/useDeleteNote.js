import { useQueryClient } from '@tanstack/react-query';
import { deleteNote } from '../api/notes';
import useAuth from './useAuth';
import useAlertStore from '../stores/alertStore';
import usePendingDeleteStore from '../stores/pendingDeleteStore';

const UNDO_WINDOW_MS = 10000;

let pending = null;

export const useDeleteNote = () => {
	const { token } = useAuth();
	const queryClient = useQueryClient();

	const commit = async (task) => {
		try {
			await deleteNote(task.token, task.id);
			queryClient.setQueryData(['notes'], (old) =>
				old
					? { ...old, notes: old.notes.filter((note) => note._id !== task.id) }
					: old
			);
		} catch (error) {
			useAlertStore.getState().showAlert(error.message, 'danger');
		} finally {
			usePendingDeleteStore.getState().remove(task.id);
		}
	};

	const undo = (task) => {
		clearTimeout(task.timer);
		if (pending === task) pending = null;
		usePendingDeleteStore.getState().remove(task.id);
		useAlertStore.getState().dismissAlert();
	};

	const commitNow = (task) => {
		clearTimeout(task.timer);
		if (pending === task) pending = null;
		useAlertStore.getState().dismissAlert();
		commit(task);
	};

	const requestDelete = (id) => {
		if (pending) commitNow(pending);

		usePendingDeleteStore.getState().add(id);

		const task = { id, token };
		task.timer = setTimeout(() => commitNow(task), UNDO_WINDOW_MS);
		pending = task;

		useAlertStore.getState().showUndoAlert(
			'Note deleted',
			() => undo(task),
			() => commitNow(task)
		);
	};

	return { requestDelete };
};