import { create } from 'zustand';

const useAiSummaryStore = create((set) => ({
	noteId: null,
	open: (noteId) => set({ noteId }),
	close: () => set({ noteId: null }),
}));

export default useAiSummaryStore;
