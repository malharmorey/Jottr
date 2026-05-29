import { create } from 'zustand';

let dismissTimer;

const useAlertStore = create((set) => ({
	alert: null,
	showAlert: (message, type) => {
		clearTimeout(dismissTimer);
		set({ alert: { message, type } });
		dismissTimer = setTimeout(() => set({ alert: null }), 1800);
	},
	// sticky alert carrying an undo action; stays until acted on
	showUndoAlert: (message, onUndo) => {
		clearTimeout(dismissTimer);
		set({ alert: { message, type: 'warning', onUndo } });
	},
	dismissAlert: () => {
		clearTimeout(dismissTimer);
		set({ alert: null });
	},
}));

export default useAlertStore;
