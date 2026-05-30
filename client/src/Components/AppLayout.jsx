import { Outlet } from 'react-router';
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
