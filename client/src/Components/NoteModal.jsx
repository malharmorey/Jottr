import { useAddNote } from '../hooks/useAddNote';
import { useEditNote } from '../hooks/useEditNote';
import { useQueryClient } from '@tanstack/react-query';
import useNoteModalStore from '../stores/noteModalStore';
import CharCounter from './CharCounter';
import Modal from './Modal';

const fieldClass =
	'block w-full rounded-md border border-[#ced4da] bg-white px-3 py-1.5 text-base text-[#212529] focus:border-[#86b7fe] focus:outline-none focus:ring focus:ring-[rgba(13,110,253,0.25)]';
const labelClass = 'mb-1 block font-secondary';

function NoteModal() {
	const { mutate: addNote } = useAddNote();
	const { mutate: editNote } = useEditNote();
	const queryClient = useQueryClient();

	const open = useNoteModalStore((state) => state.open);
	const mode = useNoteModalStore((state) => state.mode);
	const editId = useNoteModalStore((state) => state.editId);
	const draft = useNoteModalStore((state) => state.draft);
	const openAdd = useNoteModalStore((state) => state.openAdd);
	const setField = useNoteModalStore((state) => state.setField);
	const close = useNoteModalStore((state) => state.close);

	const isEdit = mode === 'edit';

	const onChange = (e) => setField(e.target.name, e.target.value);

	const handleSave = () => {
		if (isEdit) {
			const original = queryClient
				.getQueryData(['notes'])
				?.pages.flatMap((page) => page.notes)
				.find((note) => note._id === editId);
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
			window.scrollTo({ top: 0, behavior: 'auto' });
		}
		close();
	};

	return (
		<>
			<button
				type='button'
				className='fixed bottom-8 right-8 z-100 flex h-16 w-16 cursor-pointer items-center justify-center rounded-full border border-frost-border bg-frost text-[2rem] font-bold tracking-[-0.24px] text-white backdrop-blur-[7px] backdrop-saturate-191'
				onClick={openAdd}
				aria-label='Add a note'
			>
				<i className='fa-solid fa-plus' aria-hidden='true'></i>
			</button>

			<Modal
				open={open}
				onOpenChange={(o) => {
					if (!o) close();
				}}
				title={isEdit ? 'Edit Note' : 'New Note'}
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
							className='modalBtn modalBtn-primary'
							disabled={draft.title.length < 3 || draft.description.length < 5}
							onClick={handleSave}
						>
							Save
						</button>
					</>
				}
			>
				<form>
					<div className='mb-4'>
						<label htmlFor='title' className={labelClass}>
							Title:
						</label>
						<input
							type='text'
							name='title'
							className={fieldClass}
							id='title'
							onChange={onChange}
							value={draft.title}
							minLength={3}
							maxLength={200}
							placeholder={'Your note title'}
							required
						/>
						<div className='text-right'>
							<CharCounter value={draft.title} max={200} />
						</div>
					</div>
					<div className='mb-4'>
						<label htmlFor='description' className={labelClass}>
							Note:
						</label>
						<textarea
							className={fieldClass}
							id='description'
							name='description'
							rows='6'
							onChange={onChange}
							value={draft.description}
							minLength={5}
							maxLength={10000}
							placeholder={
								isEdit ? 'Type to edit your note...' : 'Type your note here....'
							}
							required
						></textarea>
						<div className='text-right'>
							<CharCounter value={draft.description} max={10000} />
						</div>
					</div>
					<div className='mb-4'>
						<label htmlFor='tag' className={labelClass}>
							Tags:
						</label>
						<input
							type='text'
							className={fieldClass}
							id='tag'
							name='tag'
							onChange={onChange}
							value={draft.tag}
							maxLength={60}
							placeholder={'#Personal'}
						/>
						<div className='text-right'>
							<CharCounter value={draft.tag} max={60} />
						</div>
					</div>
				</form>
			</Modal>
		</>
	);
}

export default NoteModal;
