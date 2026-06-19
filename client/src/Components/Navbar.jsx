import { NavLink } from 'react-router';
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '../StyleSheets/navbar.css';
import { useNavigate } from 'react-router';
import { useQueryClient } from '@tanstack/react-query';
import useAlertStore from '../stores/alertStore';
import useAuth from '../hooks/useAuth';
import jottrLogo from '../images/logo512.png';

const Navbar = () => {
	const queryClient = useQueryClient();
	const showAlert = useAlertStore((state) => state.showAlert);
	const { logout, isLoggedIn, userName } = useAuth();

	const navigate = useNavigate();

	// Logging out current user and clearing user's notes array
	const handleLogout = () => {
		logout();
		navigate('/login');
		queryClient.removeQueries({ queryKey: ['notes'] });
		showAlert('Logged out successfully', 'success');
	};

	// Close the mobile navbar after a nav link is selected
	const closeNavbar = () => {
		const menu = document.getElementById('navbarSupportedContent');
		if (menu?.classList.contains('show')) {
			bootstrap.Collapse.getOrCreateInstance(menu).hide();
		}
	};

	return (
		<>
			<nav id='navbar' className=' navbar  navbar-expand-lg '>
				<div className='container-fluid'>
					<NavLink
						className='navbar-brand  navTitle'
						to='/'
						onClick={closeNavbar}
					>
						<img className='jottrLogo' src={jottrLogo} alt='' />
						Jottr
					</NavLink>
					<button
						className='navbar-toggler'
						type='button'
						data-bs-toggle='collapse'
						data-bs-target='#navbarSupportedContent'
						aria-controls='navbarSupportedContent'
						aria-expanded='false'
						aria-label='Toggle navigation'
					>
						<span className='navbar-toggler-icon'></span>
					</button>
					<div
						className='collapse navbar-collapse'
						id='navbarSupportedContent'
					>
						<ul className='navbar-nav me-auto mb-2 mb-lg-0'>
							<li className='nav-item'>
								<NavLink
									to='/'
									className='nav-link navLink'
									onClick={closeNavbar}
								>
									Home
								</NavLink>
							</li>
							<li className='nav-item'>
								<NavLink
									to='/about'
									className='nav-link navLink'
									onClick={closeNavbar}
								>
									About
								</NavLink>
							</li>
						</ul>
						{isLoggedIn && (
							<div className='btnContainer'>
								<div className='dropdown' style={{ display: 'inline-block' }}>
									<button
										type='button'
										className='me-4 loginBtn dropdown-toggle'
										id='dropdownMenuLink'
										data-bs-toggle='dropdown'
										data-bs-display='static'
										aria-expanded='false'
									>
										{userName ? userName : 'User'}
									</button>
									<ul
										className='dropdown-menu dropdown-menu-end'
										aria-labelledby='dropdownMenuLink'
									>
										<li>
											<button
												type='button'
												className='dropdown-item'
												data-bs-toggle='collapse'
												data-bs-target='.navbar-collapse.show'
												onClick={handleLogout}
											>
												Logout
											</button>
										</li>
									</ul>
								</div>
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
