import React, { useContext, useEffect } from 'react';
import noteContext from '../context/notes/NoteContext';
import alertContext from '../context/alerts/AlertContext';
import { useNavigate } from 'react-router-dom';
import NoteCard from './NoteCard';

function SetNotes(props) {
	// Notes-Context
	const context = useContext(noteContext);
	const { reversedNotesArray, getAllNotes } = context;
	// Alert-Context
	const Alertcontext = useContext(alertContext);
	const { showAlert } = Alertcontext;

	let navigate = useNavigate();

	useEffect(() => {
		if (localStorage.getItem('token') !== null) {
			getAllNotes();
		} else {
			navigate('/login');
			showAlert('Please login first', 'danger');
		}
	}, []); // eslint-disable-line
	return (
		<>
			<div className='row'>
				{reversedNotesArray.length === 0 && (
					<NoteCard title={'Nothing in Here, but you and me'} date={''} />
				)}
				{reversedNotesArray.map((note) => {
					return (
						<div className='col-md-6 p-0' key={note._id}>
							<NoteCard
								title={note.title ? note.title : 'No title available'}
								description={
									note.description
										? note.description
										: 'No description available'
								}
								tag={note.tag}
								date={note.date}
								id={note._id}
								updateNote={props.updateNote}
								note={note}
							/>
						</div>
					);
				})}
			</div>
		</>
	);
}

export default SetNotes;
