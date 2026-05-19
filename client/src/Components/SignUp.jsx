import React, { useState, useContext } from 'react';
import '../StyleSheets/signup.css';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import alertContext from '../context/alerts/AlertContext';

const SignUp = (props) => {
	// Alert-Context
	const Alertcontext = useContext(alertContext);
	const { showAlert } = Alertcontext;

	const [credentials, setCredentials] = useState({
		name: '',
		email: '',
		password: '',
	});
	const { host, title } = props;
	document.title = `${title}`;
	let navigate = useNavigate();

	const handleSignUp = async (e) => {
		e.preventDefault();
		await fetch(`${host}/api/auth/createUser`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				name: credentials.name,
				email: credentials.email,
				password: credentials.password,
			}),
		})
			.then(async (response) => {
				const json = await response.json();
				if (json.success) {
					localStorage.setItem('token', json.authToken);
					navigate('/');
					showAlert('Account created sccessfully!', 'success');
					setCredentials({
						name: '',
						email: '',
						password: '',
					});
				} else {
					if (json.message === undefined) {
						showAlert(
							'Password must contain atleast 1 lowerCase, 1 upperCase, 1 number and 1 symbol',
							'warning'
						);
					} else {
						showAlert(`${json.message}`, 'danger');
					}
				}
			})
			.catch((error) => {
				showAlert(`${error.message}`, 'danger');
			});
	};

	const onChange = (e) => {
		setCredentials({ ...credentials, [e.target.name]: e.target.value });
	};

	return (
		<>
			<div className='loginContainer '>
				<div className='signUpCard '>
					<div className='loginCardHeader'>
						<p>👤SignUp Here</p>
					</div>
					<div className='loginCardBody'>
						<form onSubmit={handleSignUp}>
							<div className='mb-3'>
								<label htmlFor='name' className='form-label'>
									Full Name
								</label>
								<input
									type='name'
									name='name'
									className='form-control inputField'
									id='name'
									aria-describedby='emailHelp'
									placeholder='John Doe'
									value={credentials.name}
									onChange={onChange}
									required
									minLength={4}
								/>
							</div>
							<div className='mb-3'>
								<label htmlFor='email' className='form-label'>
									Username
								</label>
								<input
									type='email'
									name='email'
									className='form-control inputField'
									id='email'
									aria-describedby='emailHelp'
									placeholder='john@example.com'
									value={credentials.email}
									onChange={onChange}
									required
								/>
								<div id='emailHelp' className='form-text'>
									We'll never share your email with anyone else.
								</div>
							</div>
							<div className='mb-3' data-tip='This is the text of the tooltip2'>
								<label htmlFor='password' className='form-label'>
									Password
								</label>
								<input
									type='password'
									name='password'
									className='form-control inputField'
									id='password'
									placeholder='Password'
									value={credentials.password}
									onChange={onChange}
									minLength={5}
									required
									data-bs-toggle='tooltip'
									data-bs-placement='top'
									trigger='hover'
									title='Password must contain atleast 1 lowerCase, 1 upperCase, 1 number and 1 symbol'
								/>
							</div>
							<div className='mb-3 text-center'>
								<Link className='signupLink' to='/login'>
									Login Here
								</Link>
							</div>
							<button type='submit' className='btn loginPageBtn w-100'>
								Sign Up
							</button>
						</form>
					</div>
				</div>
			</div>
		</>
	);
};

export default SignUp;
