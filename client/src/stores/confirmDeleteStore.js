import { create } from 'zustand';

const useConfirmDeleteStore = create((set) => ({
	id: null,
	open: (id) => set({ id }),
	close: () => set({ id: null }),
}));

export default useConfirmDeleteStore;
