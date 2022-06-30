/** @type {import('@playwright/test').PlaywrightTestConfig} */
//https://playwright.dev/docs/api/class-testconfig
const config= {
	use: {
		headless: true,
	},
	webServer: {
		command: 'npm run build && npm run preview',
		port: 3000
	},
	testDir: './tests'
};

export default config;
