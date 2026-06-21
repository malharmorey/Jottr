import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
	plugins: [react(), tailwindcss()],
	build: {
		sourcemap: false,
	},
	test: {
		environment: 'jsdom',
		globals: true,
		setupFiles: './src/tests/setup.js',
		css: false,
		coverage: {
			provider: 'v8',
			reporter: ['text', 'html'],
			include: ['src/**/*.{js,jsx}'],
			exclude: ['src/tests/**', 'src/main.jsx', 'src/**/*.test.{js,jsx}'],
		},
	},
});
