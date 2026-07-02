import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		environment: 'node',
		globals: true,
		setupFiles: './tests/setup.js',
		// in-RAM MongoDB: the first run downloads its binary and index builds take a moment
		hookTimeout: 60000,
	},
});
