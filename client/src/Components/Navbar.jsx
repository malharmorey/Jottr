import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useQueryClient } from '@tanstack/react-query';
import useAlertStore from '../stores/alertStore';
import useAuth from '../hooks/useAuth';
import jottrLogo from '../images/logo512.png';

const navLink =
	'block py-2 font-secondary text-[1.05rem] font-medium text-white no-underline lg:px-2';

const Navbar = () => {
	const [menuOpen, setMenuOpen] = useState(false);
	const queryClient = useQueryClient();
	const showAlert = useAlertStore((state) => state.showAlert);
	const { logout, isLoggedIn, userName } = useAuth();

	const navigate = useNavigate();

	const closeMenu = () => setMenuOpen(false);

	// Logging out current user and clearing user's notes array
	const handleLogout = () => {
		logout();
		navigate('/login');
		queryClient.removeQueries({ queryKey: ['notes'] });
		showAlert('Logged out successfully', 'success');
		closeMenu();
	};

	return (
		<>
			<nav
				id='navbar'
				className="fixed top-0 z-[99] w-screen py-1 text-white before:absolute before:inset-0 before:-z-[1] before:border before:border-[rgba(255,255,255,0.125)] before:bg-[rgba(43,52,76,0.56)] before:backdrop-blur-[7px] before:backdrop-saturate-[191%] before:content-['']"
			>
				<div className='flex flex-wrap items-center justify-between px-3'>
					<NavLink
						className='flex items-center pt-[7px] font-primary text-[1.5rem] font-bold text-white no-underline'
						to='/'
						onClick={closeMenu}
					>
						<img className='mb-[5px] mr-[7px] h-6 w-6' src={jottrLogo} alt='' />
						Jottr
					</NavLink>

					<button
						type='button'
						className='cursor-pointer border-none bg-transparent p-1 focus:outline-none lg:hidden'
						onClick={() => setMenuOpen((open) => !open)}
						aria-expanded={menuOpen}
						aria-label='Toggle navigation'
					>
						<span className='hamburgerIcon' data-open={menuOpen}></span>
					</button>

					<div
						className={`${
							menuOpen ? 'flex' : 'hidden'
						} basis-full flex-col lg:flex lg:basis-auto lg:grow lg:flex-row lg:items-center`}
					>
						<ul className='mb-2 ml-2 flex list-none flex-col lg:mb-0 lg:mr-auto lg:flex-row'>
							<li>
								<NavLink to='/' className={navLink} onClick={closeMenu}>
									Home
								</NavLink>
							</li>
							<li>
								<NavLink to='/about' className={navLink} onClick={closeMenu}>
									About
								</NavLink>
							</li>
						</ul>

						{isLoggedIn && (
							<div className='ml-2'>
								<DropdownMenu.Root>
									<DropdownMenu.Trigger asChild>
										<button
											type='button'
											className='flex cursor-pointer items-center border-none bg-transparent p-0 py-2 font-secondary text-[1.05rem] font-medium text-white outline-none'
										>
											{userName ? userName : 'User'}
											<i
												className='fa-solid fa-caret-down ml-2'
												aria-hidden='true'
											></i>
										</button>
									</DropdownMenu.Trigger>
									<DropdownMenu.Portal>
										<DropdownMenu.Content
											align='end'
											sideOffset={6}
											className='navDropdown z-[100] min-w-fit rounded-md border border-[rgba(255,255,255,0.125)] bg-[rgba(43,52,76,0.56)] backdrop-blur-[7px] backdrop-saturate-[191%]'
										>
											<DropdownMenu.Item
												className='cursor-pointer px-3 py-2 text-[1.05rem] text-white outline-none'
												onSelect={handleLogout}
											>
												Logout
											</DropdownMenu.Item>
										</DropdownMenu.Content>
									</DropdownMenu.Portal>
								</DropdownMenu.Root>
							</div>
						)}
					</div>
				</div>
			</nav>
			<div className='underNavbar' style={{ height: '3.6rem' }}></div>
		</>
	);
};

export default Navbar;
