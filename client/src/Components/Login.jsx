import { useState } from 'react';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { Link } from 'react-router';
import useLogin from '../hooks/useLogin';

const inputClass =
	'frost-input mb-0 block w-full rounded-md px-3 py-1.5 text-base text-white placeholder:text-[rgba(33,37,41,0.75)] focus:outline-none';

const Login = ({ title }) => {
	const [credentials, setCredentials] = useState({ email: '', password: '' });
	const [showPassword, setShowPassword] = useState(false);
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
			<div className='frost relative w-2/5 max-w-md max-[1000px]:w-1/2 max-[700px]:w-[65%] max-[500px]:w-4/5 max-[400px]:w-full'>
				<div>
					<p className='mx-8 mb-2 mt-8 text-center font-secondary text-[2.1rem] font-semibold max-[500px]:text-[2rem] max-[400px]:text-[1.8rem]'>
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
							<div className='relative'>
								<input
									type={showPassword ? 'text' : 'password'}
									name='password'
									className={`${inputClass} pr-10`}
									id='password'
									placeholder='Password'
									value={credentials.password}
									onChange={onChange}
									required
								/>
								{credentials.password && (
									<button
										type='button'
										onClick={() => setShowPassword((prev) => !prev)}
										className='absolute inset-y-0 right-0 flex cursor-pointer items-center border-none bg-transparent pr-3 text-white/70 transition-colors hover:text-white focus:outline-none'
										aria-label={showPassword ? 'Hide password' : 'Show password'}
										aria-pressed={showPassword}
									>
										{showPassword ? (
											<svg
												className='h-5 w-5'
												viewBox='0 0 24 24'
												fill='none'
												stroke='currentColor'
												strokeWidth='2'
												strokeLinecap='round'
												strokeLinejoin='round'
												aria-hidden='true'
											>
												<path d='M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24' />
												<line x1='1' y1='1' x2='23' y2='23' />
											</svg>
										) : (
											<svg
												className='h-5 w-5'
												viewBox='0 0 24 24'
												fill='none'
												stroke='currentColor'
												strokeWidth='2'
												strokeLinecap='round'
												strokeLinejoin='round'
												aria-hidden='true'
											>
												<path d='M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z' />
												<circle cx='12' cy='12' r='3' />
											</svg>
										)}
									</button>
								)}
							</div>
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
							className="relative mb-8 w-full cursor-pointer overflow-hidden rounded-md border-none bg-white px-3 py-1.5 font-secondary text-[1.15rem] font-bold text-black transition-colors duration-300 before:absolute before:inset-0 before:rounded-[inherit] before:bg-linear-to-r before:from-[#3c1053] before:to-[#ad5389] before:opacity-0 before:transition-opacity before:duration-300 before:content-[''] hover:bg-transparent hover:text-white hover:before:opacity-100"
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
