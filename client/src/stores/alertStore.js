import { create } from 'zustand';

let dismissTimer;

const useAlertStore = create((set) => ({
	alert: null,
	showAlert: (message, type) => {
		clearTimeout(dismissTimer);
		set({ alert: { message, type } });
		dismissTimer = setTimeout(() => set({ alert: null }), 1800);
	},

	showUndoAlert: (message, onUndo, onClose) => {
		clearTimeout(dismissTimer);
		set({ alert: { message, type: 'warning', onUndo, onClose } });
	},

	dismissAlert: () => {
		clearTimeout(dismissTimer);
		set({ alert: null });
	},
}));

export default useAlertStore;
