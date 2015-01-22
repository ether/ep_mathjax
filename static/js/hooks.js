var underscore = require('ep_etherpad-lite/static/js/underscore');
var padeditor = require('ep_etherpad-lite/static/js/pad_editor').padeditor;
var padEditor;

exports.aceInitialized = function(hook, context){
  var editorInfo = context.editorInfo;
  editorInfo.ace_editMathjax = underscore(exports.editMathjax).bind(context); // What does underscore do here?
  padEditor = context.editorInfo.editor;
};

exports.aceInitInnerdocbodyHead = function(hook_name, args, cb) {
  args.iframeHTML.push('<link rel="stylesheet" type="text/css" href="/static/plugins/ep_mathjax/static/css/ace.css"/>');
  return cb();
};

exports.aceAttribsToClasses = function(hook_name, args, cb) {
  if (args.key == 'mathjax' && args.value != "")
    return cb(["mathjax:" + args.value]);
};

exports.aceCreateDomLine = function(hook_name, args, cb) {
  if (args.cls.indexOf('mathjax:') >= 0) {
    var clss = [];
    var argClss = args.cls.split(" ");
     var value;

    for (var i = 0; i < argClss.length; i++) {
      var cls = argClss[i];
      if (cls.indexOf("mathjax:") != -1) {
	value = cls.substr(cls.indexOf(":")+1);
      } else {
	clss.push(cls);
      }
    }
    var img = "http://latex.codecogs.com/gif.latex?"+unescape(value);
    return cb([{cls: clss.join(" "), extraOpenTags: "<span class='mathjax'><span class='Mathjax'><img src='" + img + "'></span><span class='character'>", extraCloseTags: '</span>'}]);
  }

  return cb();
};

exports.postAceInit = function(hook_name, context){
  context.ace.callWithAce(function(ace){
    var doc = ace.ace_getDocument();
    var $inner = $(doc).find('#innerdocbody');
    $inner.on("click", ".mathjax", underscore(exports.editMathjaxClick).bind(ace));
  }, 'tasklist', true);
};

var wrap = function (obj) {
  var wrapper = $("<div></div>");
  wrapper.append(obj);
  return wrapper;
}

exports.editMathjax = function(lineNumber){
  var ace = this;
  var rep = this.rep;
  var latex = this.documentAttributeManager.getAttributeOnLine(lineNumber, 'mathjax');
  latex = unescape(latex.replace(/\&space;/g, ' ').replace(/\&plus;/g, '+').replace(/\&hash;/g, '#').replace(/\@plus;/g, '+').replace(/\@hash;/g, '#'));  
  console.log("latex", latex);
  $("#mathjaxModal").slideDown("fast");
  $("#mathjaxSrc").val(latex);
  $('#mathjaxSrc').change();
}

exports.editMathjaxClick = function(event){
  console.log(event);
  var target = event.target;
  var parent = $(target).closest("div");
  var lineNumber = parent.prevAll().length;
  padEditor.callWithAce(function(ace){ // call the function to apply the attribute inside ACE
    ace.ace_editMathjax(lineNumber);
  }, 'tasklist', true); // TODO what's the second attribute do here?
}
