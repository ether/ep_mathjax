'use strict';

const assert = require('assert').strict;
const common = require('ep_etherpad-lite/tests/backend/common');

// The timeslider renders pad content with the same markup as the editor, but in its own document
// rather than in the ACE inner iframe, so the stylesheet added by the aceInitInnerdocbodyHead
// client hook never reaches it. Without the eejsBlock_timesliderStyles hook the line attribute
// marker character (`*`) is visible next to every formula in the timeslider, and the formula
// itself loses its spacing and background.
describe('ep_mathjax timeslider styles', function () {
  this.timeout(60000);
  let agent;

  before(async function () {
    agent = await common.init();
  });

  it('links the editor stylesheet into the timeslider document', async function () {
    const res = await agent.get('/p/ep_mathjax_timeslider_test/timeslider?embed=1').expect(200);
    assert.match(res.text, /ep_mathjax\/static\/css\/ace\.css/);
  });

  it('uses a path that resolves from /p/<pad>/timeslider', async function () {
    const res = await agent.get('/p/ep_mathjax_timeslider_test/timeslider?embed=1').expect(200);
    // The timeslider lives one level deeper than the pad, so the link must climb two levels.
    assert.match(res.text, /\.\.\/\.\.\/static\/plugins\/ep_mathjax\/static\/css\/ace\.css/);
  });
});
