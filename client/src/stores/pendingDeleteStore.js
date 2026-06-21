import { create } from 'zustand';

const usePendingDeleteStore = create((set) => ({
	ids: [],
	add: (id) => set((state) => ({ ids: [...state.ids, id] })),
	remove: (id) => set((state) => ({ ids: state.ids.filter((x) => x !== id) })),
}));

export default usePendingDeleteStore;