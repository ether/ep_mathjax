'use strict';

const padeditor = require('ep_etherpad-lite/static/js/pad_editor').padeditor;
let padEditor;

/**
 * Encode a LaTeX string to a mathjax attribute value.
 */
const latexToAttrib = (latex) => latex;

/**
 * Decode a mathjax attribute value to the original LaTeX string.
 */
const attribToLatex = (attribValue) => attribValue
    // This version of the plugin stores the original LaTeX string unmodified as the attribute
    // value, so normally it is sufficient to simply return the attribute value. However, previous
    // versions of this plugin (< 2.0) replaced whitespace, '+', and '#' with substitution strings,
    // so if the mathjax attribute was created by an older version of this plugin then the
    // substitutions must be reversed. The substitution strings should never appear in an original
    // LaTeX string, so it should be safe to unconditionally reverse the substitutions (there's no
    // need to determine whether the attribute was written by an old version of the plugin).
    .replace(/&space;/g, ' ')
    .replace(/&plus;/g, '+')
    .replace(/&hash;/g, '#')
    .replace(/@plus;/g, '+')
    .replace(/@hash;/g, '#');

// Bind contexts
exports.aceInitialized = (hookName, context) => {
  const editorInfo = context.editorInfo;
  editorInfo.ace_editMathjax = exports.editMathjax.bind(context);
  editorInfo.ace_setMathjax = exports.setMathjax.bind(context);
  padEditor = context.editorInfo.editor;
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

exports.aceCreateDomLine = (hookName, args, cb) => {
  const clss = [];
  let latex = null;
  for (const cls of args.cls.split(' ')) {
    if (cls.startsWith('mathjax:')) {
      latex = decodeURIComponent(cls.slice('mathjax:'.length));
    } else {
      clss.push(cls);
    }
  }
  if (latex == null) return cb();
  // latex.codecogs.com does NOT use application/x-www-form-urlencoded for the query string. In
  // particular, a `+` character is interpreted as a plus, not a space.
  const img = `https://latex.codecogs.com/gif.latex?${encodeURIComponent(latex)}`;
  const firstTags = '<span class="mathjaxcontainer">';
  const middleTags = `<span class="mathjax"><img src="${img}"></span>`;
  const thirdTags = '<span class="character">';
  const extraOpenTags = `${firstTags}${middleTags}${thirdTags}`;
  const extraCloseTags = '</span></span>';
  return cb([{cls: clss.join(' '), extraOpenTags, extraCloseTags}]);
};


// Listen for click events
exports.postAceInit = (hookName, context) => {
  // Listen for click events of latex images
  context.ace.callWithAce((ace) => {
    const doc = ace.ace_getDocument();
    const $inner = $(doc).find('#innerdocbody');

    $inner.on('click', '.mathjax', exports.editMathjaxClick.bind(ace));
  }, 'mathjax', true);

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

  if (!lineNumber) {
    lineNumber = rep.selStart[0];
  }
  $('#mathjaxModal').removeClass('popup-show');
  const value = latexToAttrib($('#mathjaxSrc').val());
  this.documentAttributeManager.setAttributeOnLine(lineNumber, 'mathjax', value);
};
