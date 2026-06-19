import { useState } from 'react';
import '../StyleSheets/login.css';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { Link } from 'react-router';
import useLogin from '../hooks/useLogin';

const Login = ({ title }) => {
	const [credentials, setCredentials] = useState({ email: '', password: '' });
	const submitLogin = useLogin();

	useDocumentTitle(title);

	const handleLogin = (e) => {
		e.preventDefault();
		submitLogin(credentials);
	};

	const onChange = (e) => {
		setCredentials({ ...credentials, [e.target.name]: e.target.value });
	};

	return (
		<>
			<div className='loginContainer '>
				<div className='loginCard '>
					<div className='loginCardHeader'>
						<p>Login</p>
					</div>
					<div className='loginCardBody'>
						<form onSubmit={handleLogin}>
							<div className='mb-3'>
								<label htmlFor='email' className='form-label'>
									Username
								</label>
								<input
									type='email'
									name='email'
									className='form-control inputField'
									id='email'
									placeholder='john@example.com'
									value={credentials.email}
									onChange={onChange}
									required
								/>
							</div>
							<div className='mb-3'>
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
									required
								/>
							</div>
							<div className='mb-3 text-center'>
								<Link className='signupLink' to='/signup'>
									Sign Up here
								</Link>
							</div>
							<button type='submit' className='btn loginPageBtn w-100'>
								Log In
							</button>
						</form>
					</div>
				</div>
			</div>
		</>
	);
};

export default Login;
