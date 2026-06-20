import { useState } from 'react';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { Link } from 'react-router';
import useLogin from '../hooks/useLogin';

const inputClass =
	'frost-input mb-0 block w-full rounded-md px-3 py-[0.375rem] text-base text-white placeholder:text-[rgba(33,37,41,0.75)] focus:outline-none';

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
		<div className='relative mt-auto flex h-[inherit] w-[inherit] items-center justify-center'>
			<div className='frost relative h-[60%] w-2/5 max-[1000px]:w-1/2 max-[700px]:w-[65%] max-[500px]:w-4/5 max-[400px]:w-full'>
				<div>
					<p className='mx-8 mb-2 mt-8 text-center font-primary text-[2.8rem] font-semibold max-[500px]:text-[2.6rem]'>
						Login
					</p>
				</div>
				<div className='mx-8 mb-8 mt-2'>
					<form onSubmit={handleLogin}>
						<div className='mb-4'>
							<label htmlFor='email' className='mb-2 inline-block'>
								Username
							</label>
							<input
								type='email'
								name='email'
								className={inputClass}
								id='email'
								placeholder='john@example.com'
								value={credentials.email}
								onChange={onChange}
								required
							/>
						</div>
						<div className='mb-4'>
							<label htmlFor='password' className='mb-2 inline-block'>
								Password
							</label>
							<input
								type='password'
								name='password'
								className={inputClass}
								id='password'
								placeholder='Password'
								value={credentials.password}
								onChange={onChange}
								required
							/>
						</div>
						<div className='mb-4 text-center'>
							<Link
								className='font-secondary text-[rgb(108,204,252)] no-underline'
								to='/signup'
							>
								Sign Up here
							</Link>
						</div>
						<button
							type='submit'
							className="relative mb-8 w-full cursor-pointer overflow-hidden rounded-md border-none bg-white px-3 py-[0.375rem] font-secondary text-[1.15rem] font-bold text-black transition-colors duration-300 before:absolute before:inset-0 before:rounded-[inherit] before:bg-linear-to-r before:from-[#3c1053] before:to-[#ad5389] before:opacity-0 before:transition-opacity before:duration-300 before:content-[''] hover:bg-transparent hover:text-white hover:before:opacity-100"
						>
							<span className='relative'>Log In</span>
						</button>
					</form>
				</div>
			</div>
		</div>
	);
};

export default Login;
