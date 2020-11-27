var underscore = require('ep_etherpad-lite/static/js/underscore');
var padeditor = require('ep_etherpad-lite/static/js/pad_editor').padeditor;
var padEditor;

// Bind contexts
exports.aceInitialized = function (hook, context) {
  const editorInfo = context.editorInfo;
  editorInfo.ace_editMathjax = underscore(exports.editMathjax).bind(context);
  editorInfo.ace_setMathjax = underscore(exports.setMathjax).bind(context);
  padEditor = context.editorInfo.editor;
};

// CSS styling of editor
exports.aceInitInnerdocbodyHead = function (hook_name, args, cb) {
  args.iframeHTML.push('<link rel="stylesheet" type="text/css" href="../static/plugins/ep_mathjax/static/css/ace.css"/>');
  return cb();
};


exports.aceAttribsToClasses = function (hook_name, args, cb) {
  if (args.key == 'mathjax' && args.value != '') return cb([`mathjax:${args.value}`]);
};

exports.aceCreateDomLine = function (hook_name, args, cb) {
  if (args.cls.indexOf('mathjax:') >= 0) {
    const clss = [];
    const argClss = args.cls.split(' ');
    let value;

    for (let i = 0; i < argClss.length; i++) {
      const cls = argClss[i];
      if (cls.indexOf('mathjax:') != -1) {
        value = cls.substr(cls.indexOf(':') + 1);
      } else {
        clss.push(cls);
      }
    }
    const img = `${window.location.protocol}//latex.codecogs.com/gif.latex?${unescape(value)}`;
    return cb([{cls: clss.join(' '), extraOpenTags: `<span class='mathjaxcontainer ${value}'><span class='mathjax'><img src='${img}'></span><span class='character'>`, extraCloseTags: '</span></span>'}]);
  }
  return cb();
};


// Listen for click events
exports.postAceInit = function (hook_name, context) {
  // Listen for click events of latex images
  context.ace.callWithAce((ace) => {
    const doc = ace.ace_getDocument();
    const $inner = $(doc).find('#innerdocbody');
    $inner.on('click', '.mathjax', underscore(exports.editMathjaxClick).bind(ace));
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
  let latex = this.documentAttributeManager.getAttributeOnLine(lineNumber, 'mathjax');
  latex = unescape(latex.replace(/\&space;/g, ' ').replace(/\&plus;/g, '+').replace(/\&hash;/g, '#').replace(/\@plus;/g, '+').replace(/\@hash;/g, '#'));
  $('#mathjaxModal').addClass('popup-show');
  $('#mathjaxSrc').val(latex);
  $('#mathjaxSrc').change();
};

// Edit click event handle context
exports.editMathjaxClick = function (event) {
  const target = event.target;
  const parent = $(target).closest('div');
  const lineNumber = parent.prevAll().length;
  clientVars.plugins.plugins.ep_mathjax.lineNumber = lineNumber;
  padEditor.callWithAce((ace) => { // call the function to apply the attribute inside ACE
    ace.ace_editMathjax();
  }, 'tasklist', true); // TODO what's the second attribute do here?
};

// Set Mathjax
exports.setMathjax = function () {
  const ace = this;
  const rep = this.rep;
  let lineNumber = clientVars.plugins.plugins.ep_mathjax.lineNumber;

  if (!lineNumber) {
    lineNumber = rep.selStart[0];
  }
  $('#mathjaxModal').removeClass('popup-show');

  const val = $('#mathjaxSrc').val();
  const latex = val.replace(/\s/g, '&space;').replace(/\+/g, '&plus;').replace(/#/g, '&hash;');

  const documentAttributeManager = this.documentAttributeManager;
  documentAttributeManager.setAttributeOnLine(lineNumber, 'mathjax', latex); // make the line a task list
};
