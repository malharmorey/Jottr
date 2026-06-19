import { useEffect, useState } from 'react';
import useAlertStore from '../stores/alertStore';
import '../StyleSheets/alertToaster.css';

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
		<div
			className='alertToaster'
			style={{
				position: 'fixed',
				top: '3.7rem',
				left: '0',
				right: '0',
				marginLeft: 'auto',
				marginRight: 'auto',
				zIndex: '99',
			}}
		>
			<div
				className={`alert alert-${shown.type} alert-dismissible alertSlide ${
					open ? 'alertSlideOpen' : ''
				}`}
				role='alert'
				style={{ fontSize: '0.9rem' }}
				onTransitionEnd={() => {
					if (!open) setShown(null);
				}}
			>
				<strong>{shown.message}</strong>
				{shown.onUndo && (
					<button
						type='button'
						className='btn btn-sm undoBtn ms-3'
						onClick={shown.onUndo}
					>
						<i className='fa-solid fa-rotate-left me-1'></i>Undo
					</button>
				)}
				<button
					type='button'
					className='btn-close'
					aria-label='Close'
					onClick={shown.onClose || dismissAlert}
				></button>
			</div>
		</div>
	);
};

export default AlertToaster;