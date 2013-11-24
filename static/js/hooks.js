exports.aceInitInnerdocbodyHead = function(hook_name, args, cb) {
  args.iframeHTML.push('<link rel="stylesheet" type="text/css" href="/static/plugins/ep_mathjax/static/css/ace.css"/>');
  args.iframeHTML.push('<script type="text/javascript" src="http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML"></script>');
//  args.iframeHTML.push('<script type="text/javascript"> MathJax.Hub.Register.StartupHook("TeX Jax Ready ", function () {top.console.log("MathJax enabled");} );</script>');
  args.iframeHTML.push('<script type="text/javascript">MathJax.Hub.Startup.signal.Interest(function (m) {console.log(m)});</script>');
  args.iframeHTML.push('<script type="text/javascript">MathJax.Hub.signal.Interest(function (message) {console.log("Hub: "+message)});</script>');

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

    return cb([{cls: clss.join(" "), extraOpenTags: "<math>" + unescape(value) + "</math><span class='character'>", extraCloseTags: "</span>"}]);
  }

  return cb();
};


var wrap = function (obj) {
  var wrapper = $("<div></div>");
  wrapper.append(obj);
  return wrapper;
}

var filter = function (node) {
  node = $(node);
  if (node.children().length) {
    node.children().each(function () { filter(this); });
  }
  if (!node.is("math")) {
    node.replaceWith(node.children().clone());
  }
}

