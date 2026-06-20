import { useEffect, useRef } from 'react';
import { useDeleteNote } from '../hooks/useDeleteNote';
import '../StyleSheets/noteModal.css';

function ConfirmDeleteModal() {
	const { requestDelete } = useDeleteNote();
	const modalRef = useRef(null);
	const noteIdRef = useRef(null);

	useEffect(() => {
		const el = modalRef.current;
		const onShow = (e) => {
			noteIdRef.current = e.relatedTarget?.getAttribute('data-note-id') ?? null;
		};
		el.addEventListener('show.bs.modal', onShow);
		return () => el.removeEventListener('show.bs.modal', onShow);
	}, []);

	const handleDelete = () => {
		if (noteIdRef.current) requestDelete(noteIdRef.current);
	};

	return (
		<div
			className='modal fade'
			id='confirmDeleteModal'
			tabIndex='-1'
			aria-labelledby='confirmDeleteModalLabel'
			aria-hidden='true'
			ref={modalRef}
		>
			<div className='modal-dialog modal-sm modal-dialog-centered'>
				<div className='modal-content modalCard'>
					<div className='modal-header'>
						<h5 className='modal-title' id='confirmDeleteModalLabel'>
							Warning!
						</h5>
						<button
							type='button'
							className='btn-close'
							data-bs-dismiss='modal'
							aria-label='Close'
						></button>
					</div>
					<div className='modal-body'>
						<p className='mb-0'>Are you sure you want to delete this note?</p>
					</div>
					<div className='modal-footer'>
						<button
							type='button'
							className='btn btn-primary bg-primary bg-gradient'
							data-bs-dismiss='modal'
						>
							Cancel
						</button>
						<button
							type='button'
							className='btn btn-danger bg-danger bg-gradient'
							data-bs-dismiss='modal'
							onClick={handleDelete}
						>
							Delete
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default ConfirmDeleteModal;
