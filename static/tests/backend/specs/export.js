'use strict';

const assert = require('assert').strict;
const Changeset = require('ep_etherpad-lite/static/js/Changeset');
const hooks = require('ep_mathjax/hooks');

const AttributePoolModule = require('ep_etherpad-lite/static/js/AttributePool');
const AttributePool = AttributePoolModule.default || AttributePoolModule;
const AttributeMapModule = require('ep_etherpad-lite/static/js/AttributeMap');
const AttributeMap = AttributeMapModule.default || AttributeMapModule;

// Build the (apool, attribution line) pair that core hands to getLineHTMLForExport for a line
// carrying the given line attributes.
const makeLine = (text, lineAttribs) => {
  const apool = new AttributePool();
  const attribs = new AttributeMap(apool);
  for (const [k, v] of Object.entries(lineAttribs)) attribs.set(k, v);
  const attribLine = `${attribs.toString()}+${text.length.toString(36)}`;
  // Sanity check: the fixture must be parseable by the same code core uses.
  const [op] = Changeset.deserializeOps(attribLine);
  assert.equal(op.chars, text.length);
  return {apool, attribLine};
};

const exportLine = async (text, lineAttribs) => {
  const {apool, attribLine} = makeLine(text, lineAttribs);
  const context = {line: {text}, lineContent: text, text, apool, attribLine, padId: 'testpad'};
  await hooks.getLineHTMLForExport('getLineHTMLForExport', context);
  return context.lineContent;
};

describe('ep_mathjax getLineHTMLForExport', function () {
  it('leaves lines without a mathjax attribute alone', async function () {
    assert.equal(await exportLine('Hello world', {}), 'Hello world');
  });

  it('exports the formula as an image and drops the line attribute marker', async function () {
    const html = await exportLine('*Hello world', {mathjax: 'x^2+y^2=z^2'});
    assert.equal(
        html,
        '<img src="https://latex.codecogs.com/gif.latex?x%5E2%2By%5E2%3Dz%5E2" ' +
        'alt="x^2+y^2=z^2">Hello world');
    // The marker character must not leak into the exported document.
    assert.ok(!html.includes('*'));
  });

  it('exports a formula on a line with no other text', async function () {
    const html = await exportLine('*', {mathjax: '\\frac{a}{b}'});
    assert.equal(
        html,
        '<img src="https://latex.codecogs.com/gif.latex?%5Cfrac%7Ba%7D%7Bb%7D" ' +
        'alt="\\frac{a}{b}">');
  });

  it('escapes LaTeX that would otherwise break out of the attributes', async function () {
    const html = await exportLine('*', {mathjax: '"><script>alert(1)</script>'});
    assert.ok(!html.includes('<script>'));
    assert.ok(html.includes('&quot;&gt;&lt;script&gt;'));
  });

  it('never emits a bare asterisk, which other plugins strip', async function () {
    // ep_align's getLineHTMLForExport removes the first literal `*` it finds in the line content,
    // so a `*` inside our URL or alt text would be silently corrupted.
    const html = await exportLine('*', {mathjax: 'a*b'});
    assert.ok(!html.includes('*'));
    assert.ok(html.includes('%2A'));
    assert.ok(html.includes('&#42;'));
  });

  it('reverses the pre-2.0 attribute value substitutions', async function () {
    const html = await exportLine('*', {mathjax: 'a&space;&plus;&space;b'});
    assert.ok(html.includes('alt="a + b"'));
  });
});
