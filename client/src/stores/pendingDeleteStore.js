import { create } from 'zustand';

// note ids hidden from the list while their delete waits out the undo window
const usePendingDeleteStore = create((set) => ({
	ids: [],
	add: (id) => set((state) => ({ ids: [...state.ids, id] })),
	remove: (id) => set((state) => ({ ids: state.ids.filter((x) => x !== id) })),
}));

export default usePendingDeleteStore;