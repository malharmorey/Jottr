import React from 'react';
import '../StyleSheets/home.css';
import UpdateNotes from './UpdateNotes';
import NewNote from './NewNote';
import ScrollToTop from 'react-scroll-to-top';
import ScrollToTopBtn from './ScrollToTopBtn';

const Home = (props) => {
	document.title = `CloudBook | ${props.title}`;
	return (
		<>
			<h2 className='pageHeading'>Your Notes 📝</h2>
			<UpdateNotes />
			<div className='ScrollToTop'>
				<ScrollToTop smooth component={<ScrollToTopBtn />} />
			</div>
			<NewNote />
		</>
	);
};

export default Home;
