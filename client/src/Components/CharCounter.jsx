import React from 'react';

const CharCounter = ({ value, max }) => {
	const className = value.length > max - 20 ? 'text-danger' : 'text-muted';
	return (
		<small className={className}>
			{value.length}/{max}
		</small>
	);
};

export default CharCounter;