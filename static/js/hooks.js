'use strict';

const padeditor = require('ep_etherpad-lite/static/js/pad_editor').padeditor;
const {attribToLatex, latexToUrl} = require('./shared');
let padEditor;

/**
 * Encode a LaTeX string to a mathjax attribute value.
 */
const latexToAttrib = (latex) => latex;

// Bind contexts
exports.aceInitialized = (hookName, context) => {
  const editorInfo = context.editorInfo;
  editorInfo.ace_editMathjax = exports.editMathjax.bind(context);
  editorInfo.ace_setMathjax = exports.setMathjax.bind(context);
};

// CSS styling of editor
exports.aceInitInnerdocbodyHead = (hookName, args, cb) => {
  const cssPath = '../static/plugins/ep_mathjax/static/css/ace.css';
  args.iframeHTML.push(`<link rel="stylesheet" type="text/css" href="${cssPath}"/>`);
  return cb();
};


exports.aceAttribsToClasses = (hookName, args, cb) => {
  if (args.key !== 'mathjax' || args.value === '') return cb();
  return cb([`mathjax:${encodeURIComponent(attribToLatex(args.value))}`]);
};

const latexFromClasses = (cls) => {
  for (const c of cls.split(' ')) {
    if (c.startsWith('mathjax:')) return decodeURIComponent(c.slice('mathjax:'.length));
  }
  return null;
};

// `mathjax` is a line attribute, so the formula is rendered from the line attribute marker rather
// than from the line's text.
//
// This must use aceDomLineProcessLineAttributes and not aceCreateDomLine. Core stops processing a
// line attribute marker as soon as any plugin's aceDomLineProcessLineAttributes modifier reports
// `processedMarker`, and it does so *before* it calls aceCreateDomLine. Rendering from
// aceCreateDomLine therefore silently produced nothing on any line that also carried another line
// attribute -- ep_align sets `processedMarker`, so a formula could not be shown on an aligned line.
//
// Reporting `processedMarker` ourselves also means core drops the marker character instead of
// drawing it, so the stray `*` next to each formula is gone.
exports.aceDomLineProcessLineAttributes = (hookName, args) => {
  const latex = latexFromClasses(args.cls);
  if (latex == null) return [];
  return [{
    preHtml: '<span class="mathjaxcontainer">' +
             `<span class="mathjax"><img src="${latexToUrl(latex)}"></span>`,
    postHtml: '</span>',
    processedMarker: true,
  }];
};


// The ACE inner document, which is where the rendered formulas live.
//
// This cannot be obtained from `ace_getDocument()`: at postAceInit time that hands back a
// document whose body is not `#innerdocbody`, so a handler delegated from it never sees a click
// on a formula. Walk the two iframes instead.
const aceInnerDocument = () => $('iframe[name="ace_outer"]').contents()
    .find('iframe[name="ace_inner"]').contents();

exports.postAceInit = (hookName, context) => {
  // The handle used to re-enter ACE from the click handler below. The aceInitialized context does
  // not carry one (it is {editorInfo, rep, documentAttributeManager}), so reading it from there
  // left `padEditor` undefined and clicking a formula threw instead of opening the edit dialog.
  padEditor = context.ace;

  // Listen for click events on the rendered formulas, so that clicking one reopens the dialog with
  // its LaTeX. Delegated, because the formulas are (re)created by the renderer at any time.
  aceInnerDocument().on('click', '.mathjax', exports.editMathjaxClick);

  // When we write mathjax to the page give it context so ti knows line number
  $('#doMathjax').click(() => {
    context.ace.callWithAce((ace) => { // call the function to apply the attribute inside ACE
      ace.ace_setMathjax();
    }, 'mathjax', true); // TODO what's the second attribute do here?
    padeditor.ace.focus();
  });
};

// Edit Mathjax -- Get the latex on a line and set the edit box with this value
exports.editMathjax = function () {
  const lineNumber = clientVars.plugins.plugins.ep_mathjax.lineNumber;
  const attrib = this.documentAttributeManager.getAttributeOnLine(lineNumber, 'mathjax');
  const latex = attribToLatex(attrib);
  setTimeout(() => {
    $('#mathjaxModal').addClass('popup-show');
  }, 100);
  $('#mathjaxSrc').val(latex);
  $('#mathjaxSrc').change();
};

// Edit click event handle context
exports.editMathjaxClick = (event) => {
  const target = event.target;
  const parent = $(target).closest('div');
  const lineNumber = parent.prevAll().length;
  clientVars.plugins.plugins.ep_mathjax.lineNumber = lineNumber;
  // call the function to apply the attribute inside ACE
  padEditor.callWithAce((ace) => {
    ace.ace_editMathjax();
  }, 'mathjax', true);
};

// Set Mathjax
exports.setMathjax = function () {
  const rep = this.rep;
  let lineNumber = clientVars.plugins.plugins.ep_mathjax.lineNumber;

  // `false` means "not editing an existing formula" -- use the caret's line. Line 0 is a valid
  // line number, so this must not be a truthiness test or a formula on the first line of a pad
  // would be written to wherever the caret happened to be instead.
  if (lineNumber === false || lineNumber == null) {
    lineNumber = rep.selStart[0];
  }
  $('#mathjaxModal').removeClass('popup-show');
  const value = latexToAttrib($('#mathjaxSrc').val());
  this.documentAttributeManager.setAttributeOnLine(lineNumber, 'mathjax', value);
};
