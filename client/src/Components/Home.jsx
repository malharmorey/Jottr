import '../StyleSheets/home.css';
import useDocumentTitle from '../hooks/useDocumentTitle';
import NotesList from './NotesList';
import NoteModal from './NoteModal';
import AiSummaryModal from './AiSummaryModal';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import ScrollToTopBtn from './ScrollToTopBtn';

const Home = ({ title }) => {
	useDocumentTitle(`Jottr | ${title}`);
	return (
		<>
			<h2 className='pageHeading'>Your Notes 📝</h2>
			<NotesList />
			<ScrollToTopBtn />
			<NoteModal />
			<AiSummaryModal />
			<ConfirmDeleteModal />
		</>
	);
};

export default Home;
