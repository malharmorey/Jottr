import { useEffect, useState } from 'react';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { Link } from 'react-router';

const WandIcon = ({ className }) => (
	<svg viewBox='0 0 24 24' className={className} aria-hidden='true'>
		<line
			x1='4'
			y1='20'
			x2='14.5'
			y2='9.5'
			stroke='currentColor'
			strokeWidth='2.4'
			strokeLinecap='round'
		/>
		<path
			fill='currentColor'
			d='M17.5 2.8l.95 2.25 2.25.95-2.25.95L17.5 9.2l-.95-2.25-2.25-.95 2.25-.95L17.5 2.8z'
		/>
		<path
			fill='currentColor'
			d='M7 2l.6 1.4L9 4l-1.4.6L7 6l-.6-1.4L5 4l1.4-.6L7 2z'
		/>
		<path
			fill='currentColor'
			d='M20.5 11l.55 1.3 1.3.55-1.3.55L20.5 14.7l-.55-1.3-1.3-.55 1.3-.55L20.5 11z'
		/>
	</svg>
);

const SUMMARIES = [
	"Diya's birthday lunch is Saturday at home. Call Nani, order sweets, get balloons.",
	"Small family lunch for Diya's birthday Saturday. Errands left: Nani, sweets, balloons.",
	"Saturday is Diya's birthday lunch at home. To do: call Nani, sweets, balloons.",
	"Hosting Diya's birthday lunch Saturday, gulab jamun not cake. Nani, sweets, balloons pending.",
	"Diya's birthday Saturday: lunch at home, then call Nani, order sweets, get balloons.",
	"Family lunch for Diya's birthday Saturday. Still need Nani, sweets, and balloons.",
];

const prefersReducedMotion = () =>
	window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const About = ({ title }) => {
	useDocumentTitle(`Jottr | ${title}`);
	const [phase, setPhase] = useState('idle'); // 'idle' | 'loading' | 'done'
	const [index, setIndex] = useState(0);

	// pick a different summary than the one showing
	const pickNext = () =>
		setIndex((prev) => {
			let next = Math.floor(Math.random() * SUMMARIES.length);
			if (next === prev) next = (next + 1) % SUMMARIES.length;
			return next;
		});

	const summarize = () => {
		if (prefersReducedMotion()) {
			pickNext();
			return setPhase('done');
		}
		setPhase('loading');
		setTimeout(() => {
			pickNext();
			setPhase('done');
		}, 650);
	};

	// run it once on load so a passive visitor sees the payoff
	useEffect(() => {
		const reduce = prefersReducedMotion();
		const reveal = () => {
			setIndex(Math.floor(Math.random() * SUMMARIES.length));
			setPhase('done');
		};
		const timers = [
			setTimeout(() => {
				if (reduce) return reveal();
				setPhase('loading');
				timers.push(setTimeout(reveal, 650));
			}, 800),
		];
		return () => timers.forEach(clearTimeout);
	}, []);

	return (
		<div className='frost mx-auto my-4 w-full max-w-160 px-8 py-9 max-[500px]:px-5 max-[500px]:py-7'>
			<p className='font-primary text-[2.6rem] font-bold leading-none max-[400px]:text-[2.2rem]'>
				Jottr
			</p>
			<p className='mt-2 font-secondary text-[1.35rem] font-semibold max-[400px]:text-[1.2rem]'>
				Notes that{' '}
				<span className='text-[rgb(108,204,252)]'>summarize themselves.</span>
			</p>

			<p className='mt-4 font-secondary text-[1.1rem] leading-relaxed text-white/85'>
				Jottr is a cloud notebook for everything worth keeping: the thoughts,
				reminders, and loose ideas. Write as much as
				you like, and when a note runs long, one tap turns it into a clean summary
				written by AI. Handy, right? Sign up below.
			</p>

			<div className='mt-6'>
				<div className='rounded-lg bg-white/5 p-4'>
					<span className='mb-1 block font-secondary text-[0.7rem] uppercase tracking-wider text-white/45'>
						your note
					</span>
					<p className='font-primary text-[1.1rem] leading-snug text-white/90'>
						Mom called about Diya&rsquo;s birthday on Saturday. A small lunch at
						home, gulab jamun instead of a cake, just close family. Still need to
						call Nani, order the sweets, and pick up balloons.
					</p>
				</div>

				<div className='my-3 flex justify-center'>
					<button
						type='button'
						onClick={summarize}
						className='inline-flex cursor-pointer items-center gap-2 rounded-full border border-[#0dcaf0]/40 bg-[#0dcaf0]/10 px-4 py-1.5 font-secondary text-[0.95rem] text-[#0dcaf0] transition-colors duration-200 hover:bg-[#0dcaf0]/20'
					>
						<WandIcon className='aboutWand h-4 w-4' />
						{phase === 'done' ? 'Summarize again' : 'Summarize'}
					</button>
				</div>

				<div className='relative overflow-hidden rounded-lg border-l-2 border-[#0dcaf0] bg-[#0dcaf0]/10 p-4'>
					<span className='mb-2 flex items-center gap-1.5 font-secondary text-[0.7rem] uppercase tracking-wider text-[#0dcaf0]'>
						<WandIcon className='h-3 w-3' />
						AI summary
					</span>
					{phase === 'loading' ? (
						<div aria-hidden='true'>
							<div className='shimmer-bar h-3 w-full'></div>
							<div className='shimmer-bar mt-2 h-3 w-4/5'></div>
						</div>
					) : phase === 'done' ? (
						<>
							<p className='aboutSummary font-secondary text-[1.05rem] leading-snug text-white'>
								{SUMMARIES[index]}
							</p>
							<span className='aboutSheen' aria-hidden='true'></span>
						</>
					) : (
						<p className='font-secondary text-[1rem] italic text-white/40'>
							Tap Summarize to condense the note above.
						</p>
					)}
				</div>
			</div>

			<p className='mt-6 font-secondary text-[0.95rem] text-[rgb(217,216,216)]'>
				Private by default. Synced instantly, ready on any device.
			</p>

			<div className='mt-6'>
				<Link
					to='/signup'
					className='inline-block rounded-md bg-linear-to-r from-[#3c1053] to-[#ad5389] px-5 py-2.5 font-secondary font-semibold text-white no-underline transition-opacity duration-300 hover:opacity-90'
				>
					Create a free account →
				</Link>
			</div>
		</div>
	);
};

export default About;
