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
				{/* 1fr→0fr lets the heading give its width to the expanding search bar */}
				<div
					className={`grid min-w-0 transition-[grid-template-columns,opacity] duration-300 ease-pro ${
						searchOpen
							? 'max-md:grid-cols-[0fr] max-md:opacity-0 grid-cols-[1fr]'
							: 'grid-cols-[1fr] opacity-100'
					}`}
				>
					<h2 className='min-w-0 overflow-hidden whitespace-nowrap font-secondary text-[2.1rem] font-semibold max-[500px]:text-[2rem] max-[400px]:text-[1.8rem]'>
						Your Notes
					</h2>
				</div>
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
