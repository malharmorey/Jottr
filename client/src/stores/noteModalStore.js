import { create } from 'zustand';

const emptyDraft = { title: '', description: '', tag: '' };

const useNoteModalStore = create((set) => ({
	mode: null,
	editId: null,
	draft: emptyDraft,
	openAdd: () => set({ mode: 'add', editId: null, draft: emptyDraft }),
	openEdit: (note) =>
		set({
			mode: 'edit',
			editId: note._id,
			draft: { title: note.title, description: note.description, tag: note.tag },
		}),
	setField: (name, value) =>
		set((state) => ({ draft: { ...state.draft, [name]: value } })),
	close: () => set({ mode: null, editId: null, draft: emptyDraft }),
}));

export default useNoteModalStore;