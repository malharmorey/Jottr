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
			<h2 className='mx-1 font-secondary text-[2.1rem] font-semibold max-[500px]:text-[2rem] max-[400px]:text-[1.8rem]'>
				Your Notes
			</h2>
			<NotesList />
			<ScrollToTopBtn />
			<NoteModal />
			<AiSummaryModal />
			<ConfirmDeleteModal />
		</>
	);
};

export default Home;
