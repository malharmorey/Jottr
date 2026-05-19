import React, { useContext } from 'react';
import moment from 'moment';
import noteContext from '../context/notes/NoteContext';
import '../StyleSheets/noteCard.css';
import pic from '../../src/images/pngegg.png';

function NoteCard(props) {
	// Notes-Context
	const context = useContext(noteContext);
	const { deleteNote } = context;

	return (
		<div className='my-3'>
			<div
				className='card m-auto '
				id='notesCard'
				style={
					moment(props.date).isValid()
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
						{moment(props.date).isValid() ? (
							''
						) : (
							<img className='astronautImg' src={pic} alt='' />
						)}
					</p>
					<p className='card-text notesCardTag'>{props.tag}</p>
					<p className='card-text mb-3'>
						<small
							className={`${moment(props.date).isValid() ? '' : 'd-none'}`}
						>
							Updated{' '}
							{moment(props.date).isValid()
								? [moment(props.date).startOf('minutes').fromNow()]
								: 'long ago'}
						</small>
					</p>

					<i
						className={`fa-regular fa-pen-to-square fa-lg text-warning fontIcon ${
							moment(props.date).isValid() ? '' : 'd-none'
						}`}
						role='button'
						onClick={() => {
							props.updateNote(props.note);
						}}
					></i>

					<i
						className={`fa-regular fa-trash-can mx-4 fa-lg text-danger fontIcon ${
							moment(props.date).isValid() ? '' : 'd-none'
						}`}
						role='button'
						onClick={() => {
							deleteNote(props.id);
						}}
					></i>
				</div>
			</div>
		</div>
	);
}

export default NoteCard;
