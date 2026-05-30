import React from 'react';
import '../StyleSheets/home.css';
import NotesList from './NotesList';
import NoteModal from './NoteModal';
import ScrollToTop from 'react-scroll-to-top';
import ScrollToTopBtn from './ScrollToTopBtn';

const Home = (props) => {
	document.title = `CloudBook | ${props.title}`;
	return (
		<>
			<h2 className='pageHeading'>Your Notes 📝</h2>
			<NotesList />
			<div className='ScrollToTop'>
				<ScrollToTop smooth component={<ScrollToTopBtn />} />
			</div>
			<NoteModal />
		</>
	);
};

export default Home;
