import React, { useState } from 'react';
import '../StyleSheets/newNote.css';
import { useAddNote } from '../hooks/useAddNote';
import CharCounter from './CharCounter';

function NewNote() {
	const { mutate: addNote } = useAddNote();

	const [note, setNote] = useState({
		title: '',
		description: '',
		tag: '',
	});

	const handleSaveClick = () => {
		addNote({ title: note.title, description: note.description, tag: note.tag });
		setNote({ title: '', description: '', tag: '' });
	};
	const handleCloseClick = () => {
		setNote({ title: '', description: '', tag: '' });
	};
	const onChange = (e) => {
		setNote({ ...note, [e.target.name]: e.target.value });
	};
	return (
		<>
			<button
				type='button'
				className='btn  addNewNoteBtn'
				data-bs-toggle='modal'
				data-bs-target='#newModal'
			>
				<i className='fa-solid fa-plus'></i>
			</button>

			{/* ///////--------------NEW-NOTE-MODAL------------////// */}
			<div
				className='modal fade'
				id='newModal'
				tabIndex='-1'
				aria-labelledby='exampleModalLabel'
				aria-hidden='true'
			>
				<div className='modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable'>
					<div className='modal-content modalCard'>
						<div className='modal-header'>
							<h5 className='modal-title' id='exampleModalLabel'>
								New Note
							</h5>
							<button
								type='button'
								className='btn-close'
								data-bs-dismiss='modal'
								aria-label='Close'
							></button>
						</div>
						<div className='modal-body'>
							<form>
								<div className='mb-3'>
									<label htmlFor='title' className='col-form-label'>
										Title:
									</label>
									<input
										type='text'
										name='title'
										className='form-control '
										id='title'
										onChange={onChange}
										value={note.title}
										minLength={3}
										maxLength={200}
										placeholder={'Your note title'}
										required
									/>
									<div className='text-end'>
										<CharCounter value={note.title} max={200} />
									</div>
								</div>
								<div className='mb-3'>
									<label htmlFor='description' className='col-form-label'>
										Note:
									</label>
									<textarea
										className='form-control '
										id='description'
										name='description'
										rows='6'
										onChange={onChange}
										value={note.description}
										minLength={5}
										maxLength={10000}
										placeholder={'Type your note here....'}
										required
									></textarea>
									<div className='text-end'>
										<CharCounter value={note.description} max={10000} />
									</div>
								</div>
								<div className='mb-3'>
									<label htmlFor='tag' className='col-form-label'>
										Tags:
									</label>
									<input
										type='text'
										className='form-control '
										id='tag'
										name='tag'
										onChange={onChange}
										value={note.tag}
										maxLength={60}
										placeholder={'#Personal'}
									/>
									<div className='text-end'>
										<CharCounter value={note.tag} max={60} />
									</div>
								</div>
							</form>
						</div>
						<div className='modal-footer'>
							<button
								type='button'
								className='btn btn-secondary bg-secondary bg-gradient'
								data-bs-dismiss='modal'
								onClick={handleCloseClick}
							>
								❌ Close
							</button>
							<button
								type='button'
								className='btn btn-primary bg-primary bg-gradient'
								data-bs-dismiss='modal'
								disabled={note.title.length < 3 || note.description.length < 5}
								onClick={handleSaveClick}
							>
								💾 Save
							</button>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default NewNote;
