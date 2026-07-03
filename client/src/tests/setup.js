import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';
import useNoteModalStore from '../stores/noteModalStore';
import useAiSummaryStore from '../stores/aiSummaryStore';
import useConfirmDeleteStore from '../stores/confirmDeleteStore';
import usePendingDeleteStore from '../stores/pendingDeleteStore';
import useAlertStore from '../stores/alertStore';

const stores = [
	useNoteModalStore,
	useAiSummaryStore,
	useConfirmDeleteStore,
	usePendingDeleteStore,
	useAlertStore,
];

window.matchMedia ??= (query) => ({
	matches: false,
	media: query,
	onchange: null,
	addEventListener: () => {},
	removeEventListener: () => {},
	addListener: () => {},
	removeListener: () => {},
	dispatchEvent: () => false,
});

window.scrollTo = () => {};
Element.prototype.scrollIntoView = () => {};
// @formkit/auto-animate calls the Web Animations API, which jsdom lacks.
Element.prototype.animate = () => ({
	finished: Promise.resolve(),
	cancel: () => {},
	finish: () => {},
	play: () => {},
	pause: () => {},
	addEventListener: () => {},
	removeEventListener: () => {},
	onfinish: null,
	oncancel: null,
});
Element.prototype.hasPointerCapture = () => false;
Element.prototype.setPointerCapture = () => {};
Element.prototype.releasePointerCapture = () => {};

global.ResizeObserver = class {
	observe() {}
	unobserve() {}
	disconnect() {}
};

global.IntersectionObserver = class {
	observe() {}
	unobserve() {}
	disconnect() {}
};

afterEach(() => {
	cleanup();
	sessionStorage.clear();
	vi.restoreAllMocks();
	// reset every Zustand store so open modals / pending deletes don't leak
	stores.forEach((store) => store.setState(store.getInitialState(), true));
});
