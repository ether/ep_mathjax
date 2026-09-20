'use strict';

const eejs = require('ep_etherpad-lite/node/eejs');
const Changeset = require('ep_etherpad-lite/static/js/Changeset');
const {attribToLatex, latexToUrl, escapeAttrib} = require('./static/js/shared');

// Core's AttributeMap is an ES module, so under some loaders `require()` hands back the module
// namespace object rather than the class itself.
const AttributeMapModule = require('ep_etherpad-lite/static/js/AttributeMap');
const AttributeMap = AttributeMapModule.default || AttributeMapModule;

exports.eejsBlock_editbarMenuLeft = (hookName, args, cb) => {
  args.content += eejs.require('./templates/editbarButtons.ejs', {}, module);
  return cb();
};

exports.eejsBlock_editorContainerBox = (hookName, args, cb) => {
  args.content += eejs.require('./templates/modals.ejs', {}, module);
  return cb();
};

exports.eejsBlock_scripts = (hookName, args, cb) => {
  args.content += eejs.require('./templates/scripts.ejs', {}, module);
  return cb();
};

exports.eejsBlock_styles = (hookName, args, cb) => {
  args.content += eejs.require('./templates/styles.ejs', {}, module);
  return cb();
};

/**
 * Read the `mathjax` line attribute off an attribution line, or null if the line has none.
 */
const mathjaxOnLine = (attribLine, apool) => {
  if (!attribLine) return null;
  const [op] = Changeset.deserializeOps(attribLine);
  if (op == null) return null;
  const value = AttributeMap.fromString(op.attribs, apool).get('mathjax');
  return value ? attribToLatex(value) : null;
};

/**
 * Render the formula into the exported HTML.
 *
 * Without this hook the `mathjax` line attribute is dropped on export: the exported document only
 * contains the line attribute marker character (`*`), so the formula is lost from HTML exports and
 * from every format derived from them (doc, docx, odt, pdf).
 *
 * The <img> survives in HTML exports. Etherpad deliberately strips remote images from the
 * document before handing it to LibreOffice or html-to-docx (they would otherwise fetch the URL
 * server side, making export an SSRF sink) and replaces each one with its `alt` text, so word
 * processor exports get the LaTeX source of the formula instead of a silently empty line.
 */
exports.getLineHTMLForExport = async (hookName, context) => {
  const latex = mathjaxOnLine(context.attribLine, context.apool);
  if (latex == null) return;
  // Drop the line attribute marker character; it is not part of the document's content.
  let lineContent = context.lineContent;
  if (context.text.indexOf('*') === 0) lineContent = lineContent.replace('*', '');
  const img =
      `<img src="${escapeAttrib(latexToUrl(latex))}" alt="${escapeAttrib(latex)}">`;
  context.lineContent = `${img}${lineContent}`;
  return context.lineContent;
};
