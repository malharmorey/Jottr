import { useEffect } from 'react';
import { useNotes } from '../hooks/useNotes';
import useInView from '../hooks/useInView';
import useAlertStore from '../stores/alertStore';
import useAuth from '../hooks/useAuth';
import { useNavigate } from 'react-router';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import NoteCard from './NoteCard';
import Shimmer from './Shimmer';

function NotesList() {
	const {
		data: notesArray = [],
		isLoading,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useNotes();
	const showAlert = useAlertStore((state) => state.showAlert);
	const { isLoggedIn } = useAuth();

	const [animationParent] = useAutoAnimate({
		duration: 400,
		easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
	});
	const [sentinelRef, sentinelInView] = useInView();

	const navigate = useNavigate();

	useEffect(() => {
		if (!isLoggedIn) {
			navigate('/login');
			showAlert('Please login first', 'danger');
		}
	}, [isLoggedIn, navigate, showAlert]);

	useEffect(() => {
		if (sentinelInView && hasNextPage && !isFetchingNextPage) fetchNextPage();
	}, [sentinelInView, hasNextPage, isFetchingNextPage, fetchNextPage]);

	if (!isLoggedIn) return null;

	return (
		<>
			<div className='flex flex-wrap items-start' ref={animationParent}>
				{isLoading ? (
					<Shimmer />
				) : notesArray.length === 0 ? (
					<NoteCard title={'Nothing in Here, but you and me'} date={''} />
				) : (
					notesArray.map((note) => (
						<div className='w-full md:w-1/2' key={note._id}>
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
			{isFetchingNextPage && (
				<div className='flex flex-wrap items-start'>
					<Shimmer />
				</div>
			)}
			{!isLoading && !hasNextPage && notesArray.length > 0 && (
				<p className='my-8 text-center font-secondary text-[1.05rem] text-white/60'>
					No more notes down here. Just you and me again.
				</p>
			)}
			<div ref={sentinelRef} aria-hidden='true'></div>
		</>
	);
}

export default NotesList;
