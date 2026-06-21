import { render, screen } from '@testing-library/react';
import CharCounter from '../Components/CharCounter';

describe('CharCounter', () => {
	it('shows the current length out of the max', () => {
		render(<CharCounter value='hello' max={200} />);
		expect(screen.getByText('5/200')).toBeInTheDocument();
	});

	it('stays the muted colour with plenty of room left', () => {
		render(<CharCounter value='hi' max={200} />);
		expect(screen.getByText('2/200')).toHaveClass('text-[#f8f9fa]');
	});

	it('turns red within 20 characters of the max', () => {
		render(<CharCounter value={'x'.repeat(185)} max={200} />);
		expect(screen.getByText('185/200')).toHaveClass('text-[#dc3545]');
	});
});
