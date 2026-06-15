import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import '../StyleSheets/noteModal.css';
import useAiSummaryStore from '../stores/aiSummaryStore';
import useAlertStore from '../stores/alertStore';
import { useSummarizeNote } from '../hooks/useSummarizeNote';
import pic from '../images/pngegg.png';

function AiSummaryModal() {
	const noteId = useAiSummaryStore((state) => state.noteId);
	const close = useAiSummaryStore((state) => state.close);
	const showAlert = useAlertStore((state) => state.showAlert);
	const { data: summary, isFetching, isError, error, refetch } =
		useSummarizeNote(noteId);
	const queryClient = useQueryClient();

	const modalRef = useRef(null);

	useEffect(() => {
		const el = modalRef.current;
		const onHidden = () => {
			if (isError) {
				queryClient.removeQueries({ queryKey: ['summary', noteId] });
			}
			close();
		};
		el.addEventListener('hidden.bs.modal', onHidden);
		return () => el.removeEventListener('hidden.bs.modal', onHidden);
	}, [close, isError, noteId, queryClient]);

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
		<div
			className='modal fade'
			id='aiSummaryModal'
			tabIndex='-1'
			aria-labelledby='aiSummaryModalLabel'
			aria-hidden='true'
			ref={modalRef}
		>
			<div className='modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable'>
				<div className='modal-content modalCard'>
					<div className='modal-header'>
						<h5 className='modal-title' id='aiSummaryModalLabel'>
							AI Summary
						</h5>
						<button
							type='button'
							className='btn-close'
							data-bs-dismiss='modal'
							aria-label='Close'
						></button>
					</div>
					<div className='modal-body'>
						{isFetching ? (
							<div className='text-center py-4'>
								<div className='spinner-border text-light' role='status'>
									<span className='visually-hidden'>Loading…</span>
								</div>
							</div>
						) : isError ? (
							<div className='text-center'>
								<p className='notesCardNote'>{error.message}</p>
								<img className='astronautImg' src={pic} alt='' />
							</div>
						) : summary ? (
							<p className='notesCardNote'>{summary}</p>
						) : null}
					</div>
					<div className='modal-footer'>
						<button
							type='button'
							className='btn btn-secondary bg-secondary bg-gradient'
							onClick={() => refetch()}
							disabled={isFetching}
						>
							🔄 Retry
						</button>
						<button
							type='button'
							className='btn btn-primary bg-primary bg-gradient'
							data-bs-dismiss='modal'
							onClick={copySummary}
							disabled={!summary || isFetching}
						>
							📋 Copy
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default AiSummaryModal;
