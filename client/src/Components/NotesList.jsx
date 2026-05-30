import { useEffect } from 'react';
import { useNotes } from '../hooks/useNotes';
import useAlertStore from '../stores/alertStore';
import useAuth from '../hooks/useAuth';
import { useNavigate } from 'react-router';
import NoteCard from './NoteCard';

function NotesList() {
	const { data: reversedNotesArray = [] } = useNotes();
	const showAlert = useAlertStore((state) => state.showAlert);
	const { isLoggedIn } = useAuth();

	let navigate = useNavigate();

	useEffect(() => {
		if (!isLoggedIn) {
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
								note={note}
							/>
						</div>
					);
				})}
			</div>
		</>
	);
}

export default NotesList;
