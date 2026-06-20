import { useState } from 'react';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { Link } from 'react-router';
import useSignup from '../hooks/useSignup';

const inputClass =
	'frost-input mb-0 block w-full rounded-md px-3 py-[0.375rem] text-base text-white placeholder:text-[rgba(33,37,41,0.75)] focus:outline-none';

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
		<div className='relative mt-auto flex h-[inherit] w-[inherit] items-center justify-center'>
			<div className='frost relative h-[80%] w-2/5 max-[1000px]:w-3/5 max-[700px]:w-[70%] max-[550px]:w-4/5 max-[500px]:w-full'>
				<div>
					<p className='mx-8 mb-2 mt-8 text-center font-primary text-[2.8rem] font-semibold max-[500px]:text-[2.6rem]'>
						Sign Up
					</p>
				</div>
				<div className='mx-8 mb-8 mt-2'>
					<form onSubmit={handleSignUp}>
						<div className='mb-4'>
							<label htmlFor='name' className='mb-2 inline-block'>
								Full Name
							</label>
							<input
								type='name'
								name='name'
								className={inputClass}
								id='name'
								placeholder='John Doe'
								value={credentials.name}
								onChange={onChange}
								required
								minLength={4}
							/>
						</div>
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
								minLength={5}
								required
								title='Password must contain atleast 1 lowerCase, 1 upperCase, 1 number and 1 symbol'
							/>
						</div>
						<div className='mb-4 text-center'>
							<Link
								className='font-secondary text-[rgb(108,204,252)] no-underline'
								to='/login'
							>
								Login Here
							</Link>
						</div>
						<button
							type='submit'
							className="relative mb-8 w-full cursor-pointer overflow-hidden rounded-md border-none bg-white px-3 py-[0.375rem] font-secondary text-[1.15rem] font-bold text-black transition-colors duration-300 before:absolute before:-inset-px before:bg-linear-to-r before:from-[#3c1053] before:to-[#ad5389] before:opacity-0 before:transition-opacity before:duration-300 before:content-[''] hover:text-white hover:before:opacity-100"
						>
							<span className='relative'>Sign Up</span>
						</button>
					</form>
				</div>
			</div>
		</div>
	);
};

export default SignUp;
