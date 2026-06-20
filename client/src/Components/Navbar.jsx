import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useQueryClient } from '@tanstack/react-query';
import useAlertStore from '../stores/alertStore';
import useAuth from '../hooks/useAuth';
import jottrLogo from '../images/logo512.png';

const navLink =
	'block py-2 font-secondary text-[1.05rem] font-medium text-white no-underline nav:px-3';

const Navbar = () => {
	const [menuOpen, setMenuOpen] = useState(false);
	// right-align the logout menu under the username on desktop, left-align it
	// (under the nav items) on mobile
	const [isDesktop, setIsDesktop] = useState(() =>
		window.matchMedia('(min-width: 992px)').matches
	);
	const queryClient = useQueryClient();
	const showAlert = useAlertStore((state) => state.showAlert);
	const { logout, isLoggedIn, userName } = useAuth();

	const navigate = useNavigate();

	useEffect(() => {
		const mq = window.matchMedia('(min-width: 992px)');
		const onChange = (e) => setIsDesktop(e.matches);
		mq.addEventListener('change', onChange);
		return () => mq.removeEventListener('change', onChange);
	}, []);

	// close the open mobile menu (and its logout dropdown) on any click outside
	useEffect(() => {
		if (!menuOpen) return;
		const onPointerDown = (e) => {
			const nav = document.getElementById('navbar');
			if (nav && !nav.contains(e.target)) setMenuOpen(false);
		};
		document.addEventListener('pointerdown', onPointerDown);
		return () => document.removeEventListener('pointerdown', onPointerDown);
	}, [menuOpen]);

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
				className="fixed top-0 z-99 w-screen py-1 text-white before:absolute before:inset-0 before:-z-1 before:border before:border-frost-border before:bg-frost before:backdrop-blur-[7px] before:backdrop-saturate-191 before:content-['']"
			>
				<div className='flex flex-wrap items-center justify-between px-3 nav:px-4'>
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
						className='cursor-pointer border-none bg-transparent p-1 focus:outline-none nav:hidden'
						onClick={() => setMenuOpen((open) => !open)}
						aria-expanded={menuOpen}
						aria-label='Toggle navigation'
					>
						<span className='hamburgerIcon' data-open={menuOpen}></span>
					</button>

					{/* grid 0fr→1fr animates to the exact content height, so the mobile
					    menu opens and closes at the same smooth speed */}
					<div
						className={`grid basis-full transition-[grid-template-rows,opacity] duration-300 ease-pro nav:!block nav:!opacity-100 nav:basis-auto nav:grow ${
							menuOpen
								? 'grid-rows-[1fr] opacity-100'
								: 'grid-rows-[0fr] opacity-0'
						}`}
					>
						<div className='flex min-h-0 flex-col overflow-hidden nav:flex-row nav:items-center nav:overflow-visible'>
							<ul className='ml-2 flex list-none flex-col nav:mr-auto nav:flex-row'>
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
									<DropdownMenu.Root modal={false}>
										<DropdownMenu.Trigger asChild>
											<button
												type='button'
												className='flex cursor-pointer items-center border-none bg-transparent px-0 py-2 font-secondary text-[1.05rem] font-medium text-white outline-none nav:px-3'
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
												align={isDesktop ? 'end' : 'start'}
												sideOffset={6}
												className='navDropdown z-100 min-w-fit rounded-md border border-frost-border bg-frost backdrop-blur-[7px] backdrop-saturate-191'
											>
												<DropdownMenu.Item
													className='cursor-pointer px-4 py-2 text-[1.05rem] text-white outline-none'
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
				</div>
			</nav>
			<div className='underNavbar' style={{ height: '3.6rem' }}></div>
		</>
	);
};

export default Navbar;
