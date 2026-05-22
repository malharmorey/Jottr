import useAlertStore from '../stores/alertStore';

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
						<button
							type='button'
							className='btn-close'
							data-bs-dismiss='alert'
							aria-label='Close'
						></button>
					</div>
				</div>
			)}
		</div>
	);
};

export default AlertToaster;
