import { useEffect } from 'react';
import { useNotes } from '../hooks/useNotes';
import useAlertStore from '../stores/alertStore';
import useAuth from '../hooks/useAuth';
import { useNavigate } from 'react-router';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import NoteCard from './NoteCard';
import Shimmer from './Shimmer';

function NotesList() {
	const { data: reversedNotesArray = [], isLoading } = useNotes();
	const showAlert = useAlertStore((state) => state.showAlert);
	const { isLoggedIn } = useAuth();

	const [animationParent] = useAutoAnimate({
		duration: 250,
		easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
	});

	const navigate = useNavigate();

	useEffect(() => {
		if (!isLoggedIn) {
			navigate('/login');
			showAlert('Please login first', 'danger');
		}
	}, []); // eslint-disable-line
	return (
		<div className='row' ref={animationParent}>
			{isLoading ? (
				<Shimmer />
			) : reversedNotesArray.length === 0 ? (
				<NoteCard title={'Nothing in Here, but you and me'} date={''} />
			) : (
				reversedNotesArray.map((note) => (
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
				))
			)}
		</div>
	);
}

export default NotesList;
