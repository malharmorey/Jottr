import { create } from 'zustand';

// id of the note awaiting delete confirmation; null when the modal is closed
const useConfirmDeleteStore = create((set) => ({
	id: null,
	open: (id) => set({ id }),
	close: () => set({ id: null }),
}));

export default useConfirmDeleteStore;
