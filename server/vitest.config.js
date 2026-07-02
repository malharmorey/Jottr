import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		environment: 'node',
		globals: true,
		setupFiles: './tests/setup.js',
		// in-RAM MongoDB: the first run downloads its binary and index builds take a moment
		hookTimeout: 60000,
		coverage: {
			provider: 'v8',
			reporter: ['text', 'html'],
			// app code only — index.js and db.js are boot/infra, exercised by deploy not tests
			include: ['app.js', 'lib/**', 'middleware/**', 'models/**', 'routes/**'],
		},
	},
});
