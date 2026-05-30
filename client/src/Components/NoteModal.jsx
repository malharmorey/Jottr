import React, { useEffect, useRef } from 'react';
import '../StyleSheets/newNote.css';
import { useAddNote } from '../hooks/useAddNote';
import { useEditNote } from '../hooks/useEditNote';
import { useQueryClient } from '@tanstack/react-query';
import useNoteModalStore from '../stores/noteModalStore';
import CharCounter from './CharCounter';

function NoteModal() {
	const { mutate: addNote } = useAddNote();
	const { mutate: editNote } = useEditNote();
	const queryClient = useQueryClient();

	const mode = useNoteModalStore((state) => state.mode);
	const editId = useNoteModalStore((state) => state.editId);
	const draft = useNoteModalStore((state) => state.draft);
	const openAdd = useNoteModalStore((state) => state.openAdd);
	const setField = useNoteModalStore((state) => state.setField);
	const close = useNoteModalStore((state) => state.close);

	const modalRef = useRef(null);

	// clear the store on every dismiss path (✕ / backdrop / Esc / Close / Save)
	useEffect(() => {
		const el = modalRef.current;
		el.addEventListener('hidden.bs.modal', close);
		return () => el.removeEventListener('hidden.bs.modal', close);
	}, [close]);

	const isEdit = mode === 'edit';

	const onChange = (e) => setField(e.target.name, e.target.value);

	const handleSave = () => {
		if (isEdit) {
			const original = queryClient
				.getQueryData(['notes'])
				?.notes.find((note) => note._id === editId);
			const unchanged =
				original &&
				original.title === draft.title &&
				original.description === draft.description &&
				original.tag === draft.tag;
			if (!unchanged) {
				editNote({
					id: editId,
					title: draft.title,
					description: draft.description,
					tag: draft.tag,
				});
			}
		} else {
			addNote({
				title: draft.title,
				description: draft.description,
				tag: draft.tag,
			});
			window.scrollTo({ top: 0, behavior: 'smooth' });
		}
	};

	return (
		<>
			<button
				type='button'
				className='btn addNewNoteBtn'
				data-bs-toggle='modal'
				data-bs-target='#noteModal'
				onClick={openAdd}
			>
				<i className='fa-solid fa-plus'></i>
			</button>

			{/* ///////--------------NOTE-MODAL (add / edit)------------////// */}
			<div
				className='modal fade'
				id='noteModal'
				tabIndex='-1'
				aria-labelledby='noteModalLabel'
				aria-hidden='true'
				ref={modalRef}
			>
				<div className='modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable'>
					<div className='modal-content modalCard'>
						<div className='modal-header'>
							<h5 className='modal-title' id='noteModalLabel'>
								{isEdit ? 'Edit Note' : 'New Note'}
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
										className='form-control'
										id='title'
										onChange={onChange}
										value={draft.title}
										minLength={3}
										maxLength={200}
										placeholder={'Your note title'}
										required
									/>
									<div className='text-end'>
										<CharCounter value={draft.title} max={200} />
									</div>
								</div>
								<div className='mb-3'>
									<label htmlFor='description' className='col-form-label'>
										Note:
									</label>
									<textarea
										className='form-control'
										id='description'
										name='description'
										rows='6'
										onChange={onChange}
										value={draft.description}
										minLength={5}
										maxLength={10000}
										placeholder={
											isEdit
												? 'Type to edit your note...'
												: 'Type your note here....'
										}
										required
									></textarea>
									<div className='text-end'>
										<CharCounter value={draft.description} max={10000} />
									</div>
								</div>
								<div className='mb-3'>
									<label htmlFor='tag' className='col-form-label'>
										Tags:
									</label>
									<input
										type='text'
										className='form-control'
										id='tag'
										name='tag'
										onChange={onChange}
										value={draft.tag}
										maxLength={60}
										placeholder={'#Personal'}
									/>
									<div className='text-end'>
										<CharCounter value={draft.tag} max={60} />
									</div>
								</div>
							</form>
						</div>
						<div className='modal-footer'>
							<button
								type='button'
								className='btn btn-secondary bg-secondary bg-gradient'
								data-bs-dismiss='modal'
							>
								❌ Close
							</button>
							<button
								type='button'
								className={`btn bg-gradient ${
									isEdit ? 'btn-success bg-success' : 'btn-primary bg-primary'
								}`}
								data-bs-dismiss='modal'
								disabled={draft.title.length < 3 || draft.description.length < 5}
								onClick={handleSave}
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

export default NoteModal;