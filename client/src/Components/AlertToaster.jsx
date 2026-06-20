import { useEffect, useState } from 'react';
import useAlertStore from '../stores/alertStore';

// Coordinated soft-tinted palettes: bg, border, text and any inline button all
// share one hue per type, so the close ✕ (text-current) and the Undo button
// always match the toast they sit in.
const toastStyles = {
	success: 'bg-[#e7f6ec] border-[#bfe3cb] text-[#1a6b3c]',
	danger: 'bg-[#fdeaea] border-[#f3c2c2] text-[#9b2c2c]',
	warning: 'bg-[#fdf4e3] border-[#f0dca8] text-[#8a5a00]',
};

const AlertToaster = () => {
	const alert = useAlertStore((state) => state.alert);
	const dismissAlert = useAlertStore((state) => state.dismissAlert);

	const [shown, setShown] = useState(alert);
	const [open, setOpen] = useState(false);

	useEffect(() => {
		if (alert) {
			setShown(alert);
			setOpen(true);
		} else {
			setOpen(false);
		}
	}, [alert]);

	if (!shown) return null;

	return (
		<div className='fixed left-1/2 top-[calc(3.6rem+2px)] z-99 -translate-x-1/2'>
			<div
				className={`toastAnim flex max-w-[88vw] items-center gap-3 rounded-lg border py-2 pl-4 pr-3 text-[0.9rem] shadow-lg nav:max-w-[48vw] ${
					toastStyles[shown.type] || toastStyles.success
				}`}
				data-state={open ? 'open' : 'closed'}
				role='alert'
				onAnimationEnd={() => {
					if (!open) setShown(null);
				}}
			>
				<strong>{shown.message}</strong>
				{shown.onUndo && (
					<button
						type='button'
						className='inline-flex shrink-0 items-center rounded border-none bg-[#8a5a00] px-2 py-1 text-[0.875rem] font-semibold text-[#fdf4e3] hover:opacity-90'
						onClick={shown.onUndo}
					>
						<i className='fa-solid fa-rotate-left mr-1'></i>Undo
					</button>
				)}
				<button
					type='button'
					className='shrink-0 cursor-pointer border-none bg-transparent leading-none text-current opacity-60 hover:opacity-100'
					aria-label='Close'
					onClick={shown.onClose || dismissAlert}
				>
					<i className='fa-solid fa-xmark' aria-hidden='true'></i>
				</button>
			</div>
		</div>
	);
};

export default AlertToaster;
