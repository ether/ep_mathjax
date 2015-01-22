var collectContentPre = function(hook, context){
  var cls = context.cls;
  var tname = context.tname;
  var state = context.state; 
  var lineAttributes = state.lineAttributes

  var tagIndex = cls.indexOf("mathjax");
  if(tagIndex === 0){
    lineAttributes['mathjax'] = tags[tagIndex];
  }

  var tagIndex = cls.indexOf("mathjax");
  if(tagIndex !== -1){
    lineAttributes['mathjax'] = 'mathjax';
  }

  if(tname === "div" || tname === "p"){
    delete lineAttributes['mathjax'];
  }

};

var collectContentPost = function(hook, context){
  var cls = context.cls;
  var tname = context.tname;
  var state = context.state;
  var lineAttributes = state.lineAttributes

  var tagIndex = cls.indexOf("mathjax");       
  if(tagIndex >= 0){
    delete lineAttributes['mathjax'];
  }
};

exports.collectContentPre = collectContentPre;
exports.collectContentPost = collectContentPost;

