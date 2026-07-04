import { useRef } from 'react';

// frosted title search; always expanded from md up, icon-that-expands below it
const SearchBar = ({ value, onChange, open, onOpen, onClose }) => {
	const inputRef = useRef(null);

	const handleIconClick = () => {
		// expand only below md — from md up the input is always out
		if (!window.matchMedia('(min-width: 768px)').matches) onOpen();
		inputRef.current?.focus();
	};

	const handleClear = () => {
		onChange('');
		inputRef.current?.focus();
	};

	return (
		<div className='flex shrink-0 items-center rounded-full border border-frost-border bg-frost p-2.5 backdrop-blur-[7px] backdrop-saturate-191'>
			<button
				type='button'
				aria-label='Search notes'
				onMouseDown={(e) => e.preventDefault()}
				onClick={handleIconClick}
				className='flex cursor-pointer items-center justify-center border-none bg-transparent p-0 text-white'
			>
				<svg
					width='19'
					height='19'
					viewBox='0 0 24 24'
					fill='none'
					stroke='currentColor'
					strokeWidth='2.5'
					strokeLinecap='round'
					aria-hidden='true'
				>
					<circle cx='11' cy='11' r='7' />
					<line x1='16.5' y1='16.5' x2='21' y2='21' />
				</svg>
			</button>
			<input
				ref={inputRef}
				type='text'
				value={value}
				onChange={(e) => onChange(e.target.value)}
				onBlur={() => {
					if (!value) onClose();
				}}
				placeholder='Search notes…'
				aria-label='Search notes'
				className={`border-none bg-transparent font-secondary text-[1.05rem] text-white outline-none transition-[width,padding] duration-300 ease-pro placeholder:text-white/60 md:w-56 md:px-2 ${
					open ? 'w-36 px-2' : 'w-0 px-0'
				}`}
			/>
			{value && (
				<button
					type='button'
					aria-label='Clear search'
					onMouseDown={(e) => e.preventDefault()}
					onClick={handleClear}
					className='flex cursor-pointer items-center justify-center border-none bg-transparent p-0 text-white/70'
				>
					<svg
						width='15'
						height='15'
						viewBox='0 0 24 24'
						stroke='currentColor'
						strokeWidth='2.5'
						strokeLinecap='round'
						aria-hidden='true'
					>
						<line x1='5' y1='5' x2='19' y2='19' />
						<line x1='19' y1='5' x2='5' y2='19' />
					</svg>
				</button>
			)}
		</div>
	);
};

export default SearchBar;
