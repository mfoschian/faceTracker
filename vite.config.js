import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
// import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		// vue(),
	],
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url))
		}
	},
	server: {
		// cors: true,
		// proxy: {
		// 	'^/api': {
		// 		target: 'https://xvoldev.protezionecivile.fvg.it/',
				
		// 		// target: 'https://xvol.protezionecivile.fvg.it/',

		// 		// target: 'http://xvoldev.protezionecivile.fvg.it:3000',
		// 		// rewrite: (path) => path.replace(/^\/api/, ''),
		// 		ws: true,
		// 		changeOrigin: true,
		// 	},
		// }
	}
})
