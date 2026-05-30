import { useState, useEffect } from 'react';
import '../StyleSheets/scrollToTopBtn.css';

function ScrollToTopBtn() {
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		const onScroll = () => setVisible(window.scrollY >= 100);
		window.addEventListener('scroll', onScroll);
		return () => window.removeEventListener('scroll', onScroll);
	}, []);

	if (!visible) return null;

	return (
		<button
			className='scrollToTopBtn'
			onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
			aria-label='Scroll to top'
		>
			<i className='fa-solid fa-arrow-up'></i>
		</button>
	);
}

export default ScrollToTopBtn;
