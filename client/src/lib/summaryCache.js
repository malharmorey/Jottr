const STORAGE_KEY = 'summaries';

const readAll = () => {
	try {
		return JSON.parse(sessionStorage.getItem(STORAGE_KEY)) || {};
	} catch {
		return {};
	}
};

const writeAll = (map) => {
	sessionStorage.setItem(STORAGE_KEY, JSON.stringify(map));
};

export const readSummary = (noteId) => readAll()[noteId];

export const writeSummary = (noteId, summary) => {
	const map = readAll();
	map[noteId] = summary;
	writeAll(map);
};

export const removeSummary = (noteId) => {
	const map = readAll();
	delete map[noteId];
	writeAll(map);
};