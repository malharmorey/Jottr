import { useEffect, useRef, useState } from 'react';

// reports whether the attached element is visible in the viewport
const useInView = () => {
	const ref = useRef(null);
	const [inView, setInView] = useState(false);

	useEffect(() => {
		if (!ref.current) return;
		const observer = new IntersectionObserver(([entry]) =>
			setInView(entry.isIntersecting)
		);
		observer.observe(ref.current);
		return () => observer.disconnect();
	}, []);

	return [ref, inView];
};

export default useInView;
