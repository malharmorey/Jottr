import NoteContext from './NoteContext';
import { useState, useContext } from 'react';
import alertContext from '../alerts/AlertContext';
const NoteState = (props) => {
	const Alertcontext = useContext(alertContext);
	const { showAlert } = Alertcontext;
	const { host, children } = props;
	const [notes, setNotes] = useState([]);
	const [userName, setUserName] = useState();

	// GET All notes
	const getAllNotes = async () => {
		// API call to server
		await fetch(`${host}/api/notes/getallnotes`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'auth-token': localStorage.getItem('token'),
			},
		})
			.then(async (response) => {
				const fetchedNotes = await response.json();
				setNotes(fetchedNotes.notes);
				setUserName(fetchedNotes.userName);
				// Alerts
				if (fetchedNotes.success !== true) {
					showAlert(`${fetchedNotes.message}`, 'danger');
				}
			})
			.catch((error) => {
				showAlert(`${error.message}`, 'danger');
			});
	};

	// ADD note
	const addNote = async (title, description, tag) => {
		// API call to server
		await fetch(`${host}/api/notes/addnote`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'auth-token': localStorage.getItem('token'),
			},
			body: JSON.stringify({ title, description, tag }),
		})
			.then(async (response) => {
				const addedNote = await response.json();
				setNotes(notes.concat(addedNote.note));
				// Alerts
				if (addedNote.success) {
					showAlert(`${addedNote.message}`, 'success');
				} else {
					addedNote.message === undefined
						? showAlert(`Oops unable to add your note`, 'warning')
						: showAlert(`${addedNote.message}`, 'danger');
				}
			})
			.catch((error) => {
				showAlert(`${error.message}`, 'danger');
			});
	};

	// EDIT note
	const editNote = async (id, title, description, tag) => {
		// API call to server
		await fetch(`${host}/api/notes/updatenote/${id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				'auth-token': localStorage.getItem('token'),
			},
			body: JSON.stringify({ title, description, tag }),
		})
			.then(async (response) => {
				const serverResponse = await response.json();
				// Alerts
				if (serverResponse.success) {
					showAlert(`${serverResponse.message}`, 'success');
					// Client-side logic to edit a note
					let newNotes = JSON.parse(JSON.stringify(notes));
					for (let index = 0; index < newNotes.length; index++) {
						const element = newNotes[index];
						if (element._id === id) {
							newNotes[index].title = title;
							newNotes[index].description = description;
							newNotes[index].tag = tag;
							newNotes[index].date = serverResponse.date;
							break;
						}
					}
					setNotes(newNotes);
				} else {
					serverResponse.message === undefined
						? showAlert(`Oops unable to update your note`, 'warning')
						: showAlert(`${serverResponse.message}`, 'danger');
				}
			})
			.catch((error) => {
				showAlert(`${error.message}`, 'danger');
			});
	};

	// DELETE note
	const deleteNote = async (id) => {
		// API call to server
		await fetch(`${host}/api/notes/deletenote/${id}`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				'auth-token': localStorage.getItem('token'),
			},
		})
			.then(async (response) => {
				const serverResponse = await response.json();
				// Alerts
				if (serverResponse.success) {
					showAlert(`${serverResponse.message}`, 'danger');
					// Client-side logic to delete a note
					let newNotesArray = notes.filter((note) => {
						return note._id !== id;
					});
					setNotes(newNotesArray);
				} else {
					serverResponse.message === undefined
						? showAlert(`Oops unable to delete your note`, 'warning')
						: showAlert(`${serverResponse.message}`, 'danger');
				}
			})
			.catch((error) => {
				showAlert(`${error.message}`, 'danger');
			});
	};

	// Clearing currentUser's notes on client side after logout
	const clearUserNotesArray = () => {
		setNotes([]);
	};

	// Reversing user notes array to display new note at the top.
	var reversedNotesArray = [...notes].reverse();
	return (
		<NoteContext.Provider
			value={{
				userName,
				reversedNotesArray,
				getAllNotes,
				addNote,
				deleteNote,
				editNote,
				clearUserNotesArray,
			}}
		>
			{children}
		</NoteContext.Provider>
	);
};

export default NoteState;
