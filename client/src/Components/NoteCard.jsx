import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useDeleteNote } from '../hooks/useDeleteNote';
import useNoteModalStore from '../stores/noteModalStore';
import useAiSummaryStore from '../stores/aiSummaryStore';
import '../StyleSheets/noteCard.css';
import pic from '../images/pngegg.png';

dayjs.extend(relativeTime);

function NoteCard({ title, description, tag, date, id, note }) {
	const { requestDelete } = useDeleteNote();
	const openEdit = useNoteModalStore((state) => state.openEdit);
	const openSummary = useAiSummaryStore((state) => state.open);

	return (
		<div className='my-3'>
			<div
				className='card m-auto '
				id='notesCard'
				style={
					dayjs(date).isValid()
						? { width: '95%' }
						: { maxWidth: 'fit-content' }
				}
			>
				<button
					type='button'
					className={`iconBtn text-info position-absolute top-0 end-0 m-3 ${
						dayjs(date).isValid() ? '' : 'd-none'
					}`}
					aria-label='Summarize note'
					data-bs-toggle='modal'
					data-bs-target='#aiSummaryModal'
					onClick={() => openSummary(id)}
				>
					<i
						className='fa-solid fa-wand-magic-sparkles fa-lg fontIcon'
						aria-hidden='true'
					></i>
				</button>
				<div className='card-body notesCardBody'>
					<h4 className='card-title notesCardTitle' id='cardTitle'>
						{title}
					</h4>

					<p className='card-text notesCardNote'>
						{description}
						{!dayjs(date).isValid() && (
							<img className='astronautImg' src={pic} alt='' />
						)}
					</p>
					<p className='card-text notesCardTag'>{tag}</p>
					<p className='card-text mb-3'>
						<small
							className={`${dayjs(date).isValid() ? '' : 'd-none'}`}
						>
							Updated{' '}
							{dayjs(date).isValid()
								? [dayjs(date).startOf('minute').fromNow()]
								: 'long ago'}
						</small>
					</p>

					<button
						type='button'
						className={`iconBtn text-warning ${
							dayjs(date).isValid() ? '' : 'd-none'
						}`}
						aria-label='Edit note'
						data-bs-toggle='modal'
						data-bs-target='#noteModal'
						onClick={() => openEdit(note)}
					>
						<i
							className='fa-regular fa-pen-to-square fa-lg fontIcon'
							aria-hidden='true'
						></i>
					</button>

					<button
						type='button'
						className={`iconBtn text-danger mx-4 ${
							dayjs(date).isValid() ? '' : 'd-none'
						}`}
						aria-label='Delete note'
						onClick={() => requestDelete(id)}
					>
						<i
							className='fa-regular fa-trash-can fa-lg fontIcon'
							aria-hidden='true'
						></i>
					</button>
				</div>
			</div>
		</div>
	);
}

export default NoteCard;
