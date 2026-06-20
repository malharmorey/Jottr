import { Outlet } from 'react-router';
import Navbar from './Navbar';

const AppLayout = () => {
	return (
		<>
			<Navbar />
			<main className='relative mx-4 my-[1.8rem] h-[inherit] w-[inherit]'>
				<Outlet />
			</main>
		</>
	);
};

export default AppLayout;
