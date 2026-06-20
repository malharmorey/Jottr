import { useDeleteNote } from '../hooks/useDeleteNote';
import useConfirmDeleteStore from '../stores/confirmDeleteStore';
import Modal from './Modal';

function ConfirmDeleteModal() {
	const { requestDelete } = useDeleteNote();
	const id = useConfirmDeleteStore((state) => state.id);
	const close = useConfirmDeleteStore((state) => state.close);

	const handleDelete = () => {
		if (id) requestDelete(id);
		close();
	};

	return (
		<Modal
			open={id != null}
			onOpenChange={(o) => {
				if (!o) close();
			}}
			title='Warning!'
			size='sm'
			footer={
				<>
					<button
						type='button'
						className='modalBtn modalBtn-secondary'
						onClick={close}
					>
						Cancel
					</button>
					<button
						type='button'
						className='modalBtn modalBtn-danger'
						onClick={handleDelete}
					>
						Delete
					</button>
				</>
			}
		>
			<p className='mb-0'>Are you sure you want to delete this note?</p>
		</Modal>
	);
}

export default ConfirmDeleteModal;
