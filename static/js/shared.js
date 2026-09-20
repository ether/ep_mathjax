'use strict';

/**
 * Decode a mathjax attribute value to the original LaTeX string.
 *
 * This version of the plugin stores the original LaTeX string unmodified as the attribute value, so
 * normally it is sufficient to simply return the attribute value. However, previous versions of this
 * plugin (< 2.0) replaced whitespace, '+', and '#' with substitution strings, so if the mathjax
 * attribute was created by an older version of this plugin then the substitutions must be reversed.
 * The substitution strings should never appear in an original LaTeX string, so it should be safe to
 * unconditionally reverse the substitutions (there's no need to determine whether the attribute was
 * written by an old version of the plugin).
 */
const attribToLatex = (attribValue) => String(attribValue == null ? '' : attribValue)
    .replace(/&space;/g, ' ')
    .replace(/&plus;/g, '+')
    .replace(/&hash;/g, '#')
    .replace(/@plus;/g, '+')
    .replace(/@hash;/g, '#');

/**
 * Build the CodeCogs rendering URL for a LaTeX string.
 *
 * latex.codecogs.com does NOT use application/x-www-form-urlencoded for the query string. In
 * particular, a `+` character is interpreted as a plus, not a space. `*` is also escaped: it is
 * left alone by encodeURIComponent(), but a literal `*` in export HTML is eaten by other plugins
 * that strip the line attribute marker character (ep_align does this).
 */
const latexToUrl = (latex) => `https://latex.codecogs.com/gif.latex?${encodeURIComponent(latex).replace(/\*/g, '%2A')}`;

/**
 * Escape a LaTeX string for use as an HTML attribute value. `*` is written as a character reference
 * for the same reason as in latexToUrl().
 */
const escapeAttrib = (str) => String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/\*/g, '&#42;');

const collectContentPre = (hook, context) => {
  let cls = context.cls;
  const tname = context.tname;
  const state = context.state;
  const lineAttributes = state.lineAttributes;

  if (!cls) return; // required for import

  const tagIndex = cls.indexOf('mathjax');
  if (tagIndex === 0) {
    //    console.log(context);
    cls = cls.split(' ');
    //    console.log(cls[1]);
    lineAttributes.mathjax = cls[1];
  }

  if (tagIndex !== -1) {
    lineAttributes.mathjax = 'mathjax';
  }

  if (tname === 'div' || tname === 'p') {
    delete lineAttributes.mathjax;
  }
};

const collectContentPost = (hook, context) => {
  const cls = context.cls;
  const state = context.state;
  const lineAttributes = state.lineAttributes;

  if (!cls) return; // required for import

  const tagIndex = cls.indexOf('mathjax');
  if (tagIndex >= 0) {
    delete lineAttributes.mathjax;
  }
};

exports.attribToLatex = attribToLatex;
exports.latexToUrl = latexToUrl;
exports.escapeAttrib = escapeAttrib;
exports.collectContentPre = collectContentPre;
exports.collectContentPost = collectContentPost;
