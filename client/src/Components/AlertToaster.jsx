import useAlertStore from '../stores/alertStore';
import '../StyleSheets/alertToaster.css';

const AlertToaster = () => {
	const alert = useAlertStore((state) => state.alert);

	return (
		<div
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
			{alert && (
				<div>
					<div
						className={`alert alert-${alert.type} alert-dismissible fade show`}
						role='alert'
						style={{ fontSize: '0.9rem' }}
					>
						<strong>{alert.message}</strong>
						{alert.onUndo && (
							<button
								type='button'
								className='btn btn-sm undoBtn ms-3'
								onClick={alert.onUndo}
							>
								<i className='fa-solid fa-rotate-left me-1'></i>Undo
							</button>
						)}
						<button
							type='button'
							className='btn-close'
							aria-label='Close'
							onClick={alert.onClose}
							data-bs-dismiss={alert.onClose ? undefined : 'alert'}
						></button>
					</div>
				</div>
			)}
		</div>
	);
};

export default AlertToaster;
