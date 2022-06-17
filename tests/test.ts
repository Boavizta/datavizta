import { expect, test } from '@playwright/test';


test.describe("it should load the content with the selected locale", ()=>{
	test('index page has expected h1', async ({ page }) => {
		await page.goto('/');
		expect(await page.textContent('h1')).toBe('Boavizta Dataviz');
	});

	test('browser locale fr should load french text', async ({browser}) => {
		const context = await browser.newContext({locale:"fr"})
		const page = await context.newPage();
		await page.goto('/');
		expect(await page.textContent('#aggridwrapper-root > div > div > div.ag-root-wrapper-body.ag-layout-normal.ag-focus-managed > div.ag-root.ag-unselectable.ag-layout-normal > div.ag-header.ag-focus-managed.ag-pivot-off > div.ag-header-viewport > div > div > div:nth-child(1) > div.ag-cell-label-container.ag-header-cell-sorted-none > div > span.ag-header-cell-text')).toBe("Fabricant");
		expect(await page.textContent('h2')).toBe('Pourquoi cette page?');
	});

	test('browser locale en should load english text', async ({browser}) => {
		const context = await browser.newContext({locale:"en"})
		const page = await context.newPage();
		await page.goto('/');
		expect(await page.textContent('#aggridwrapper-root > div > div > div.ag-root-wrapper-body.ag-layout-normal.ag-focus-managed > div.ag-root.ag-unselectable.ag-layout-normal > div.ag-header.ag-focus-managed.ag-pivot-off > div.ag-header-viewport > div > div > div:nth-child(1) > div.ag-cell-label-container.ag-header-cell-sorted-none > div > span.ag-header-cell-text')).toBe("Manufacturer");
		expect(await page.textContent('h2')).toBe('Why this page?');
	});


	test('browser locale de should fallback english', async ({browser}) => {
		const context = await browser.newContext({locale:"de"})
		const page = await context.newPage();
		await page.goto('/');
		expect(await page.textContent('#aggridwrapper-root > div > div > div.ag-root-wrapper-body.ag-layout-normal.ag-focus-managed > div.ag-root.ag-unselectable.ag-layout-normal > div.ag-header.ag-focus-managed.ag-pivot-off > div.ag-header-viewport > div > div > div:nth-child(1) > div.ag-cell-label-container.ag-header-cell-sorted-none > div > span.ag-header-cell-text')).toBe("Manufacturer");
		expect(await page.textContent('h2')).toBe('Why this page?');
	});

	test('browser switch language en > fr > en', async ({browser}) => {
		const context = await browser.newContext({locale:"en"})
		const page = await context.newPage();
		await page.goto('/');
		expect(await page.textContent('#aggridwrapper-root > div > div > div.ag-root-wrapper-body.ag-layout-normal.ag-focus-managed > div.ag-root.ag-unselectable.ag-layout-normal > div.ag-header.ag-focus-managed.ag-pivot-off > div.ag-header-viewport > div > div > div:nth-child(1) > div.ag-cell-label-container.ag-header-cell-sorted-none > div > span.ag-header-cell-text')).toBe("Manufacturer");
		await page.locator("#switch-language-button").click();
		expect(await page.textContent('#aggridwrapper-root > div > div > div.ag-root-wrapper-body.ag-layout-normal.ag-focus-managed > div.ag-root.ag-unselectable.ag-layout-normal > div.ag-header.ag-focus-managed.ag-pivot-off > div.ag-header-viewport > div > div > div:nth-child(1) > div.ag-cell-label-container.ag-header-cell-sorted-none > div > span.ag-header-cell-text')).toBe("Fabricant");
		await page.locator("#switch-language-button").click();
		expect(await page.textContent('#aggridwrapper-root > div > div > div.ag-root-wrapper-body.ag-layout-normal.ag-focus-managed > div.ag-root.ag-unselectable.ag-layout-normal > div.ag-header.ag-focus-managed.ag-pivot-off > div.ag-header-viewport > div > div > div:nth-child(1) > div.ag-cell-label-container.ag-header-cell-sorted-none > div > span.ag-header-cell-text')).toBe("Manufacturer");
	});

});
