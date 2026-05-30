import '../StyleSheets/home.css';
import NotesList from './NotesList';
import NoteModal from './NoteModal';
import ScrollToTopBtn from './ScrollToTopBtn';

const Home = ({ title }) => {
	document.title = `CloudBook | ${title}`;
	return (
		<>
			<h2 className='pageHeading'>Your Notes 📝</h2>
			<NotesList />
			<ScrollToTopBtn />
			<NoteModal />
		</>
	);
};

export default Home;
