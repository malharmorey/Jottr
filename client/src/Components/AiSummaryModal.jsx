import { useQueryClient } from '@tanstack/react-query';
import useAiSummaryStore from '../stores/aiSummaryStore';
import useAlertStore from '../stores/alertStore';
import { useSummarizeNote } from '../hooks/useSummarizeNote';
import pic from '../images/pngegg.png';
import Modal from './Modal';

function AiSummaryModal() {
	const noteId = useAiSummaryStore((state) => state.noteId);
	const close = useAiSummaryStore((state) => state.close);
	const showAlert = useAlertStore((state) => state.showAlert);
	const { data: summary, isFetching, isError, error, refetch } =
		useSummarizeNote(noteId);
	const queryClient = useQueryClient();

	// On any dismiss: evict an errored summary so reopening regenerates it.
	const handleOpenChange = (isOpen) => {
		if (!isOpen) {
			if (isError) {
				queryClient.removeQueries({ queryKey: ['summary', noteId] });
			}
			close();
		}
	};

	const copySummary = async () => {
		if (!summary) return;
		try {
			await navigator.clipboard.writeText(summary);
			showAlert('Summary copied to clipboard', 'success');
		} catch {
			showAlert('Could not copy to clipboard', 'danger');
		}
	};

	return (
		<Modal
			open={noteId != null}
			onOpenChange={handleOpenChange}
			title='AI Summary'
			footer={
				<>
					<button
						type='button'
						className='modalBtn modalBtn-secondary'
						onClick={() => refetch()}
						disabled={isFetching}
					>
						Retry
					</button>
					<button
						type='button'
						className='modalBtn modalBtn-primary'
						onClick={() => {
							copySummary();
							close();
						}}
						disabled={!summary || isFetching}
					>
						Copy
					</button>
				</>
			}
		>
			{isFetching ? (
				<div className='flex justify-center py-4'>
					<div className='h-8 w-8 animate-spin rounded-full border-4 border-white/30 border-t-white'></div>
				</div>
			) : isError ? (
				<div className='text-center'>
					<p className='font-secondary text-[1.1rem]'>{error.message}</p>
					<img
						className='mx-auto h-84 w-108 max-[530px]:h-full max-[530px]:w-full'
						src={pic}
						alt=''
					/>
				</div>
			) : summary ? (
				<p className='font-secondary text-[1.1rem]'>{summary}</p>
			) : null}
		</Modal>
	);
}

export default AiSummaryModal;
