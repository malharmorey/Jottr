import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		environment: 'node',
		globals: true,
		setupFiles: './tests/setup.js',
		hookTimeout: 60000,
		coverage: {
			provider: 'v8',
			reporter: ['text', 'html'],
			include: ['app.js', 'lib/**', 'middleware/**', 'models/**', 'routes/**'],
		},
	},
});
