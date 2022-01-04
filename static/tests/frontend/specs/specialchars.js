'use strict';

let chrome$;

before(async function () {
  await helper.aNewPad();
  chrome$ = helper.padChrome$;
});

beforeEach(async function () {
  await helper.clearPad();
});

const testCases = [
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
for (const [name, input, want] of testCases) {
  it(name, async function () {
    await helper.withFastCommit(async (incorp) => {
      const commitsBefore = helper.commits.length;
      chrome$('li > .ep_mathjax').click();
      await helper.waitForPromise(() => chrome$('#mathjaxModal').hasClass('popup-show'));
      chrome$('#mathjaxSrc').val(`a${input}b`).change();
      chrome$('#doMathjax').click();
      incorp();
      await helper.waitForPromise(() => {
        if (chrome$('#mathjaxModal').hasClass('popup-show')) return false;
        if (helper.commits.length <= commitsBefore) return false;
        const img = helper.padInner$('.mathjax img');
        return img.attr('src').endsWith(`?a${encodeURIComponent(want)}b`);
      });
    });
  });
}
