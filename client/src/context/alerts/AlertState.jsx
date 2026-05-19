import AlertContext from './AlertContext';
import { useState } from 'react';

function AlertState(props) {
	const { children } = props;
	const [alert, setAlert] = useState(null);

	const showAlert = (message, type) => {
		setAlert({
			message: message,
			type: type,
		});
		setTimeout(() => {
			setAlert(null);
		}, 1800);
	};
	return (
		<>
			<div
				style={{
					position: `fixed`,
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
			<AlertContext.Provider
				value={{
					showAlert,
				}}
			>
				{children}
			</AlertContext.Provider>
		</>
	);
}

export default AlertState;
