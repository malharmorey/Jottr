import React from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useDeleteNote } from '../hooks/useDeleteNote';
import useNoteModalStore from '../stores/noteModalStore';
import '../StyleSheets/noteCard.css';
import pic from '../../src/images/pngegg.png';

dayjs.extend(relativeTime);

function NoteCard(props) {
	const { requestDelete } = useDeleteNote();
	const openEdit = useNoteModalStore((state) => state.openEdit);

	return (
		<div className='my-3'>
			<div
				className='card m-auto '
				id='notesCard'
				style={
					dayjs(props.date).isValid()
						? { width: '95%' }
						: { maxWidth: 'fit-content' }
				}
			>
				<div className='card-body notesCardBody'>
					<h4 className='card-title notesCardTitle' id='cardTitle'>
						{props.title}
					</h4>

					<p className='card-text notesCardNote'>
						{props.description}
						{dayjs(props.date).isValid() ? (
							''
						) : (
							<img className='astronautImg' src={pic} alt='' />
						)}
					</p>
					<p className='card-text notesCardTag'>{props.tag}</p>
					<p className='card-text mb-3'>
						<small
							className={`${dayjs(props.date).isValid() ? '' : 'd-none'}`}
						>
							Updated{' '}
							{dayjs(props.date).isValid()
								? [dayjs(props.date).startOf('minute').fromNow()]
								: 'long ago'}
						</small>
					</p>

					<i
						className={`fa-regular fa-pen-to-square fa-lg text-warning fontIcon ${
							dayjs(props.date).isValid() ? '' : 'd-none'
						}`}
						role='button'
						data-bs-toggle='modal'
						data-bs-target='#noteModal'
						onClick={() => openEdit(props.note)}
					></i>

					<i
						className={`fa-regular fa-trash-can mx-4 fa-lg text-danger fontIcon ${
							dayjs(props.date).isValid() ? '' : 'd-none'
						}`}
						role='button'
						onClick={() => {
							requestDelete(props.id);
						}}
					></i>
				</div>
			</div>
		</div>
	);
}

export default NoteCard;
