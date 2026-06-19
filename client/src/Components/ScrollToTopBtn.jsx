import { useState, useEffect } from 'react';
import '../StyleSheets/scrollToTopBtn.css';

function ScrollToTopBtn() {
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		const onScroll = () => setVisible(window.scrollY >= 100);
		window.addEventListener('scroll', onScroll);
		return () => window.removeEventListener('scroll', onScroll);
	}, []);

	return (
		<button
			className={`scrollToTopBtn ${visible ? 'scrollVisible' : ''}`}
			onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
			aria-label='Scroll to top'
		>
			<i className='fa-solid fa-arrow-up'></i>
		</button>
	);
}

export default ScrollToTopBtn;
