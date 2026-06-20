import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import useNoteModalStore from '../stores/noteModalStore';
import useAiSummaryStore from '../stores/aiSummaryStore';
import pic from '../images/pngegg.png';

dayjs.extend(relativeTime);

const iconBtn = 'cursor-pointer border-none bg-transparent p-0 leading-none';

function NoteCard({ title, description, tag, date, id, note }) {
	const openEdit = useNoteModalStore((state) => state.openEdit);
	const openSummary = useAiSummaryStore((state) => state.open);

	return (
		<div className='my-4'>
			<div
				className='frost relative mx-auto'
				style={
					dayjs(date).isValid()
						? { width: '95%' }
						: { maxWidth: 'fit-content' }
				}
			>
				<button
					type='button'
					className={`${iconBtn} absolute right-0 top-0 m-4 text-[#0dcaf0] ${
						dayjs(date).isValid() ? '' : 'hidden'
					}`}
					aria-label='Summarize note'
					data-bs-toggle='modal'
					data-bs-target='#aiSummaryModal'
					onClick={() => openSummary(id)}
				>
					<i
						className='fa-solid fa-wand-magic-sparkles fa-lg max-[400px]:text-[21px]!'
						aria-hidden='true'
					></i>
				</button>
				<div className='mx-[0.3rem] my-[0.8rem] p-4 max-[500px]:mx-[0.2rem] max-[500px]:my-[1.3rem] max-[400px]:mx-0 max-[400px]:my-[1.4rem]'>
					<h4
						className='mb-2 font-primary text-[1.8rem] font-bold max-[400px]:text-[1.7rem]'
						id='cardTitle'
					>
						{title}
					</h4>

					<p className='font-secondary text-[1.1rem] max-[400px]:text-[1.05rem]'>
						{description}
						{!dayjs(date).isValid() && (
							<img
								className='h-[21rem] w-[27rem] max-[530px]:h-full max-[530px]:w-full'
								src={pic}
								alt=''
							/>
						)}
					</p>
					<p className='font-primary text-[1.1rem]'>{tag}</p>
					<p className='mb-4'>
						<small
							className={`font-bold text-[rgb(217,216,216)] ${
								dayjs(date).isValid() ? '' : 'hidden'
							}`}
						>
							Updated{' '}
							{dayjs(date).isValid()
								? [dayjs(date).startOf('minute').fromNow()]
								: 'long ago'}
						</small>
					</p>

					<button
						type='button'
						className={`${iconBtn} text-[#ffc107] ${
							dayjs(date).isValid() ? '' : 'hidden'
						}`}
						aria-label='Edit note'
						data-bs-toggle='modal'
						data-bs-target='#noteModal'
						onClick={() => openEdit(note)}
					>
						<i
							className='fa-regular fa-pen-to-square fa-lg max-[400px]:text-[21px]!'
							aria-hidden='true'
						></i>
					</button>

					<button
						type='button'
						className={`${iconBtn} mx-6 text-[#dc3545] ${
							dayjs(date).isValid() ? '' : 'hidden'
						}`}
						aria-label='Delete note'
						data-bs-toggle='modal'
						data-bs-target='#confirmDeleteModal'
						data-note-id={id}
					>
						<i
							className='fa-regular fa-trash-can fa-lg max-[400px]:text-[21px]!'
							aria-hidden='true'
						></i>
					</button>
				</div>
			</div>
		</div>
	);
}

export default NoteCard;
