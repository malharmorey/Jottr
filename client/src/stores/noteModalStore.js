import { create } from 'zustand';

const emptyDraft = { title: '', description: '', tag: '' };

const useNoteModalStore = create((set) => ({
	open: false,
	mode: null,
	editId: null,
	draft: emptyDraft,
	openAdd: () => set({ open: true, mode: 'add', editId: null, draft: emptyDraft }),
	openEdit: (note) =>
		set({
			open: true,
			mode: 'edit',
			editId: note._id,
			draft: { title: note.title, description: note.description, tag: note.tag },
		}),
	setField: (name, value) =>
		set((state) => ({ draft: { ...state.draft, [name]: value } })),
	close: () => set({ open: false, mode: null, editId: null, draft: emptyDraft }),
}));

export default useNoteModalStore;