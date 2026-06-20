import { useState, useEffect } from 'react';

function ScrollToTopBtn() {
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		const onScroll = () => setVisible(window.scrollY >= 100);
		window.addEventListener('scroll', onScroll);
		return () => window.removeEventListener('scroll', onScroll);
	}, []);

	return (
		<button
			className={`fixed bottom-[6.5rem] right-8 z-[100] flex h-[4.1rem] w-[4.1rem] transform-gpu cursor-pointer items-center justify-center rounded-full border border-[rgba(255,255,255,0.125)] bg-[rgba(43,52,76,0.56)] text-[1.8rem] font-bold tracking-[-0.24px] text-white backdrop-blur-[7px] backdrop-saturate-[191%] transition-[opacity,transform] duration-[350ms] ease-pro will-change-[transform,opacity] ${
				visible
					? 'translate-y-0 opacity-100'
					: 'pointer-events-none translate-y-6 opacity-0'
			}`}
			onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
			aria-label='Scroll to top'
		>
			<i className='fa-solid fa-arrow-up'></i>
		</button>
	);
}

export default ScrollToTopBtn;
