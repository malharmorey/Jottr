const CharCounter = ({ value, max }) => {
	const color = value.length > max - 20 ? 'text-[#dc3545]' : 'text-[#f8f9fa]';
	return (
		<small className={`font-light ${color}`}>
			{value.length}/{max}
		</small>
	);
};

export default CharCounter;
