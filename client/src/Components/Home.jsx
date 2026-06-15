import '../StyleSheets/home.css';
import useDocumentTitle from '../hooks/useDocumentTitle';
import NotesList from './NotesList';
import NoteModal from './NoteModal';
import AiSummaryModal from './AiSummaryModal';
import ScrollToTopBtn from './ScrollToTopBtn';

const Home = ({ title }) => {
	useDocumentTitle(`CloudBook | ${title}`);
	return (
		<>
			<h2 className='pageHeading'>Your Notes 📝</h2>
			<NotesList />
			<ScrollToTopBtn />
			<NoteModal />
			<AiSummaryModal />
		</>
	);
};

export default Home;
