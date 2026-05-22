import { create } from 'zustand';

let dismissTimer;

const useAlertStore = create((set) => ({
	alert: null,
	showAlert: (message, type) => {
		clearTimeout(dismissTimer);
		set({ alert: { message, type } });
		dismissTimer = setTimeout(() => set({ alert: null }), 1800);
	},
}));

export default useAlertStore;
