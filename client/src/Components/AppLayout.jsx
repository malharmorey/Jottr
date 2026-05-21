import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const AppLayout = () => {
	return (
		<>
			<Navbar />
			<main className='mainContainer'>
				<Outlet />
			</main>
		</>
	);
};

export default AppLayout;
