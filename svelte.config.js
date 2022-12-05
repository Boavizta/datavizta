import adapter from '@sveltejs/adapter-static';
import preprocess from 'svelte-preprocess';
import * as path from 'path';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess(),

	kit: {
		//https://github.com/sveltejs/kit/tree/master/packages/adapter-static#spa-mode
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: 'index.html',
			precompress: false
		}),
		prerender: { entries: [] }
/* 		
https://github.com/sveltejs/kit/pull/6197
prerender: {
			default: true
		}, */
		/* 
		
		vite: {
			resolve: {
				alias: {
					$: path.resolve('./src/')
				}
			}
		} */
	}
};

export default config;
