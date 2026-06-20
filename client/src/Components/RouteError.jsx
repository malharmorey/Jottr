import { Link, useRouteError, isRouteErrorResponse } from 'react-router';
import astronaut from '../images/pngegg.png';

const RouteError = () => {
	const error = useRouteError();

	// No error object means this rendered as the catch-all '*' route → treat as 404.
	const is404 = !error || (isRouteErrorResponse(error) && error.status === 404);

	let heading;
	let message;
	if (is404) {
		heading = '404 — Lost in space 🛸';
		message = 'This page floated off into the void. Even our astronaut could not find it.';
	} else if (isRouteErrorResponse(error)) {
		heading = `${error.status} — ${error.statusText}`;
		message = 'The server hit some turbulence. Head home and try again.';
	} else {
		heading = 'Houston, we have a problem 🚀';
		message = 'Something broke mid-orbit. Let us get you back to base.';
	}

	return (
		<div className='flex min-h-[70vh] items-center justify-center p-4'>
			<div className='frost w-full max-w-[32rem] text-center'>
				<div className='px-6 py-8'>
					<img
						className='mx-auto mb-4 block w-full max-w-[18rem]'
						src={astronaut}
						alt=''
					/>
					<h2 className='mb-[0.6rem] font-primary text-[2rem] font-bold max-[500px]:text-[1.6rem]'>
						{heading}
					</h2>
					<p className='mb-6 font-secondary text-[1.1rem] max-[500px]:text-[1.05rem]'>
						{message}
					</p>
					<Link
						to='/'
						className='inline-block rounded-[0.8rem] border border-[rgba(255,255,255,0.4)] bg-[rgba(255,255,255,0.12)] px-[1.6rem] py-[0.6rem] font-secondary font-semibold text-white no-underline transition-colors duration-200 hover:bg-[rgba(255,255,255,0.22)]'
					>
						Take me home
					</Link>
				</div>
			</div>
		</div>
	);
};

export default RouteError;
