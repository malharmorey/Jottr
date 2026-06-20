import { useEffect, useState } from 'react';
import useAlertStore from '../stores/alertStore';

// Light backgrounds with dark text (Bootstrap 5.3 alert palette), so the close
// icon stays dark — unlike the dark frost modals.
const toastStyles = {
	success: 'bg-[#d1e7dd] text-[#0a3622] border-[#a3cfbb]',
	danger: 'bg-[#f8d7da] text-[#58151c] border-[#f1aeb5]',
};

const AlertToaster = () => {
	const alert = useAlertStore((state) => state.alert);
	const dismissAlert = useAlertStore((state) => state.dismissAlert);

	const [shown, setShown] = useState(alert);
	const [open, setOpen] = useState(false);

	useEffect(() => {
		if (alert) {
			setShown(alert);
			const id = requestAnimationFrame(() => setOpen(true));
			return () => cancelAnimationFrame(id);
		}
		setOpen(false);
	}, [alert]);

	if (!shown) return null;

	return (
		<div className='fixed left-0 right-0 top-[3.7rem] z-[99] mx-auto'>
			<div
				className={`relative rounded-md border py-4 pl-4 pr-12 text-[0.9rem] transition-[transform,opacity] duration-[250ms] ease-pro ${
					toastStyles[shown.type] || toastStyles.success
				} ${open ? 'translate-y-0 opacity-100' : '-translate-y-6 opacity-0'}`}
				role='alert'
				onTransitionEnd={() => {
					if (!open) setShown(null);
				}}
			>
				<strong>{shown.message}</strong>
				{shown.onUndo && (
					<button
						type='button'
						className='ml-3 inline-flex items-center rounded border-2 border-[#997404] bg-[#997404] px-2 py-1 text-[0.875rem] font-semibold text-[#fff3cd] hover:bg-[#ad9036]'
						onClick={shown.onUndo}
					>
						<i className='fa-solid fa-rotate-left mr-1'></i>Undo
					</button>
				)}
				<button
					type='button'
					className='absolute right-3 top-1/2 -translate-y-1/2 text-current opacity-70 hover:opacity-100'
					aria-label='Close'
					onClick={shown.onClose || dismissAlert}
				>
					<i className='fa-solid fa-xmark'></i>
				</button>
			</div>
		</div>
	);
};

export default AlertToaster;
