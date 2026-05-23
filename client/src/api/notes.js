const host = import.meta.env.VITE_HOST;

const headers = (token) => ({
	'Content-Type': 'application/json',
	'auth-token': token,
});

// GET all notes of the logged-in user → { success, userName, notes }
export const getAllNotes = async (token) => {
	const response = await fetch(`${host}/api/notes/getallnotes`, {
		method: 'GET',
		headers: headers(token),
	});
	const data = await response.json();
	if (!response.ok || !data.success) {
		throw new Error(data.message || 'Failed to load your notes');
	}
	return data;
};

// POST a new note → returns the created note
export const addNote = async (token, { title, description, tag }) => {
	const response = await fetch(`${host}/api/notes/addnote`, {
		method: 'POST',
		headers: headers(token),
		body: JSON.stringify({ title, description, tag }),
	});
	const data = await response.json();
	if (!response.ok || !data.success) {
		throw new Error(data.message || 'Unable to add your note');
	}
	return data.note;
};

// PUT update an existing note
export const updateNote = async (token, id, { title, description, tag }) => {
	const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
		method: 'PUT',
		headers: headers(token),
		body: JSON.stringify({ title, description, tag }),
	});
	const data = await response.json();
	if (!response.ok || !data.success) {
		throw new Error(data.message || 'Unable to update your note');
	}
	return data;
};

// DELETE a note
export const deleteNote = async (token, id) => {
	const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
		method: 'DELETE',
		headers: headers(token),
	});
	const data = await response.json();
	if (!response.ok || !data.success) {
		throw new Error(data.message || 'Unable to delete your note');
	}
	return data;
};
