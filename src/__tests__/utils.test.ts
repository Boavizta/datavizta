/** @jest-environment jsdom */
import { toggleElement } from '../lib/utils';

test('toggleElement toggles display', () => {
	document.body.innerHTML = '<div id="m"></div>';
	toggleElement('m');
	expect(document.getElementById('m')?.style.display).toBe('block');
	toggleElement('m');
	expect(document.getElementById('m')?.style.display).toBe('none');
});
