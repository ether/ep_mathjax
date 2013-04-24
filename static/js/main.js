$(document).ready(function () {
  $("#insertmathjax").click(function () {
    // Can not use this yet, fix in main etherpad
    // padeditbar.toogleDropDown("mathjaxModal");

    var module = $("#mathjaxModal");

    if (module.css('display') != "none") {
      module.slideUp("fast");
    } else {
      module.slideDown("fast");
    }
  });

  $("#domathjax").click(function () {
    var padeditor = require('ep_etherpad-lite/static/js/pad_editor').padeditor;

    $("#mathjaxModal").slideUp("fast");

    return padeditor.ace.callWithAce(function (ace) {
      rep = ace.ace_getRep();
      ace.ace_replaceRange(rep.selStart, rep.selEnd, "E");
      ace.ace_performSelectionChange([rep.selStart[0],rep.selStart[1]-1], rep.selStart, false);
        ace.ace_performDocumentApplyAttributesToRange(rep.selStart, rep.selEnd, [["mathjax", escape($("#mathjaxSrc")[0].value)]]);
    }, "mathjax");
  });

  $("#cancelmathjax").click(function () {
    $("#mathjaxModal").slideUp("fast");
  });
});
