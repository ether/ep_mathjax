import {expect, test} from '@playwright/test';
import {clearPadContent, getPadBody, goToNewPad}
    from 'ep_etherpad-lite/tests/frontend-new/helper/padHelper';

test.beforeEach(async ({page}) => {
  await goToNewPad(page);
});

const cases: Array<[string, string, string]> = [
  ['single quote', '\'', '\''],
  ['double quote', '"', '"'],
  ['space', ' ', ' '],
  ['tab', '\t', '\t'],
  ['newline', '\n', '\n'],
  ['percent', '%', '%'],
  ['hash', '#', '#'],
  ['plus', '+', '+'],
  ['equals', '=', '='],
  ['legacy substitution: &space;', '&space;', ' '],
  ['legacy substitution: &plus;', '&plus;', '+'],
  ['legacy substitution: &hash;', '&hash;', '#'],
  ['legacy substitution: @plus;', '@plus;', '+'],
  ['legacy substitution: @hash;', '@hash;', '#'],
];

test.describe('ep_mathjax — special characters', () => {
  for (const [name, input, want] of cases) {
    test(name, async ({page}) => {
      const padBody = await getPadBody(page);
      await padBody.click();
      await clearPadContent(page);

      await page.locator('li > .ep_mathjax').click();
      await expect(page.locator('#mathjaxModal')).toHaveClass(/popup-show/, {timeout: 10_000});

      await page.evaluate((v: string) => {
        const i = document.querySelector<HTMLInputElement>('#mathjaxSrc')!;
        i.value = v;
        i.dispatchEvent(new Event('change', {bubbles: true}));
      }, `a${input}b`);
      await page.locator('#doMathjax').click();
      await expect(page.locator('#mathjaxModal')).not.toHaveClass(/popup-show/, {timeout: 10_000});

      const expectedSrcSuffix = `?a${encodeURIComponent(want)}b`;
      await expect.poll(async () => {
        const src = await padBody.locator('.mathjax img').first().getAttribute('src');
        return src && src.endsWith(expectedSrcSuffix);
      }, {timeout: 10_000}).toBe(true);
    });
  }
});
