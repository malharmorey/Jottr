const CharCounter = ({ value, max }) => {
	const className = value.length > max - 20 ? 'text-danger' : 'text-white text-light';
	return (
		<small className={`charCounter ${className}`}>
			{value.length}/{max}
		</small>
	);
};

export default CharCounter;