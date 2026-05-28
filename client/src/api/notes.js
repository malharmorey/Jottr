const host = import.meta.env.VITE_HOST;

const headers = (token) => ({
	'Content-Type': 'application/json',
	'auth-token': token,
});

const request = async (url, options, fallback) => {
	let response;
	try {
		response = await fetch(url, options);
	} catch {
		throw new Error(fallback);
	}
	const data = await response.json();
	if (!response.ok || !data.success) {
		throw new Error(data.message || fallback);
	}
	return data;
};

// GET all notes of the logged-in user → { success, notes }
export const getAllNotes = (token) =>
	request(
		`${host}/api/notes/getallnotes`,
		{ method: 'GET', headers: headers(token) },
		'Unable to load your notes'
	);

// POST a new note → returns the created note
export const addNote = async (token, { title, description, tag }) => {
	const data = await request(
		`${host}/api/notes/addnote`,
		{
			method: 'POST',
			headers: headers(token),
			body: JSON.stringify({ title, description, tag }),
		},
		'Unable to add your note'
	);
	return data.note;
};

// PUT update an existing note
export const updateNote = (token, id, { title, description, tag }) =>
	request(
		`${host}/api/notes/updatenote/${id}`,
		{
			method: 'PUT',
			headers: headers(token),
			body: JSON.stringify({ title, description, tag }),
		},
		'Unable to update your note'
	);

// DELETE a note
export const deleteNote = (token, id) =>
	request(
		`${host}/api/notes/deletenote/${id}`,
		{ method: 'DELETE', headers: headers(token) },
		'Unable to delete your note'
	);
