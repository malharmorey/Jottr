import { useEffect, useState } from 'react';

// passes the value along only after it has stopped changing for `delay` ms
const useDebouncedValue = (value, delay = 300) => {
	const [debounced, setDebounced] = useState(value);

	useEffect(() => {
		const timer = setTimeout(() => setDebounced(value), delay);
		return () => clearTimeout(timer);
	}, [value, delay]);

	return debounced;
};

export default useDebouncedValue;
