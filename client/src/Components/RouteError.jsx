import React from 'react';
import { Link, useRouteError, isRouteErrorResponse } from 'react-router';
import '../StyleSheets/routeError.css';
import astronaut from '../../src/images/pngegg.png';

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
		<div className='routeError'>
			<div className='card routeErrorCard'>
				<div className='card-body'>
					<img className='routeErrorImg' src={astronaut} alt='' />
					<h2 className='routeErrorHeading'>{heading}</h2>
					<p className='routeErrorMessage'>{message}</p>
					<Link to='/' className='routeErrorBtn'>
						Take me home
					</Link>
				</div>
			</div>
		</div>
	);
};

export default RouteError;
