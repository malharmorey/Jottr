import { useState } from 'react';
import '../StyleSheets/signup.css';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { Link } from 'react-router';
import useSignup from '../hooks/useSignup';

const SignUp = ({ title }) => {
	const [credentials, setCredentials] = useState({
		name: '',
		email: '',
		password: '',
	});
	const submitSignup = useSignup();

	useDocumentTitle(title);

	const handleSignUp = (e) => {
		e.preventDefault();
		submitSignup(credentials);
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
									minLength={5}
									required
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
