import { useState } from 'react';
import useDocumentTitle from '../hooks/useDocumentTitle';
import useDebouncedValue from '../hooks/useDebouncedValue';
import SearchBar from './SearchBar';
import NotesList from './NotesList';
import NoteModal from './NoteModal';
import AiSummaryModal from './AiSummaryModal';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import ScrollToTopBtn from './ScrollToTopBtn';

const Home = ({ title }) => {
	useDocumentTitle(`Jottr | ${title}`);
	const [query, setQuery] = useState('');
	const [searchOpen, setSearchOpen] = useState(false);
	const debouncedQuery = useDebouncedValue(query.trim());

	return (
		<>
			<div className='mx-2 flex items-center justify-between gap-2'>
				{/* max-width→0 hands the heading's space to the expanding search bar */}
				<h2
					className={`min-w-0 overflow-hidden whitespace-nowrap font-secondary text-[2.1rem] font-semibold transition-[max-width,opacity] duration-300 ease-pro max-[500px]:text-[2rem] max-[400px]:text-[1.8rem] md:max-w-none md:opacity-100 ${
						searchOpen ? 'max-w-0 opacity-0' : 'max-w-64 opacity-100'
					}`}
				>
					Your Notes
				</h2>
				<SearchBar
					value={query}
					onChange={setQuery}
					open={searchOpen}
					onOpen={() => setSearchOpen(true)}
					onClose={() => setSearchOpen(false)}
				/>
			</div>
			<NotesList searchQuery={debouncedQuery} />
			<ScrollToTopBtn />
			<NoteModal />
			<AiSummaryModal />
			<ConfirmDeleteModal />
		</>
	);
};

export default Home;
