import {expect, test} from '@playwright/test';
import {clearPadContent, getPadBody, goToNewPad}
    from 'ep_etherpad-lite/tests/frontend-new/helper/padHelper';

test.beforeEach(async ({page}) => {
  await goToNewPad(page);
});

const insertFormula = async (page: any, latex: string) => {
  await page.locator('li > .ep_mathjax').click();
  await expect(page.locator('#mathjaxModal')).toHaveClass(/popup-show/, {timeout: 10_000});
  await page.evaluate((v: string) => {
    const i = document.querySelector<HTMLInputElement>('#mathjaxSrc')!;
    i.value = v;
    i.dispatchEvent(new Event('change', {bubbles: true}));
  }, latex);
  await page.locator('#doMathjax').click();
  await expect(page.locator('#mathjaxModal')).not.toHaveClass(/popup-show/, {timeout: 10_000});
};

test.describe('ep_mathjax — rendering', () => {
  test('renders the formula without leaving the line attribute marker visible', async ({page}) => {
    const padBody = await getPadBody(page);
    await padBody.click();
    await clearPadContent(page);
    await page.keyboard.type('Hello world');

    await insertFormula(page, 'x^2');

    const img = padBody.locator('.mathjax img').first();
    await expect(img).toHaveAttribute('src', /gif\.latex\?x%5E2$/, {timeout: 10_000});
    // The marker character must not be drawn next to the formula.
    await expect.poll(async () => (await padBody.innerText()).includes('*'), {timeout: 10_000})
        .toBe(false);
  });

  test('clicking a formula reopens the dialog with its LaTeX', async ({page}) => {
    const padBody = await getPadBody(page);
    await padBody.click();
    await clearPadContent(page);

    await insertFormula(page, '\\frac{a}{b}');
    await padBody.locator('.mathjax img').first().click();

    await expect(page.locator('#mathjaxModal')).toHaveClass(/popup-show/, {timeout: 10_000});
    await expect(page.locator('#mathjaxSrc')).toHaveValue('\\frac{a}{b}');
  });
});
