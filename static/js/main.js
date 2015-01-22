$(document).ready(function () {
  $("#insertEmbedMathjax").click(function () {
    // Can not use this yet, fix in main etherpad
    var module = $("#mathjaxModal");

    if (module.css('display') != "none") {
      module.slideUp("fast");
    } else {
      module.slideDown("fast");
      redraw();
    }
  });

  $("#mathjaxSrc").on("change keyup paste", function(){
    redraw();
  });

  $("#mathsymbols").on("change", function(){
    var val = $(this).val();
    var title = $(this).find("option:selected").attr("title");
    $('#mathjaxSrc').val($('#mathjaxSrc').val() + title);
    $('#mathjaxSrc').change();
  })

  $("#greeksymbols").on("change", function(){
    var val = $(this).val();
    var title = $(this).find("option:selected").attr("title");
    $('#mathjaxSrc').val($('#mathjaxSrc').val() + title);
    $('#mathjaxSrc').change();
  })

  $("#doMathjax").click(function () {
    var padeditor = require('ep_etherpad-lite/static/js/pad_editor').padeditor;

    $("#mathjaxModal").slideUp("fast");

    return padeditor.ace.callWithAce(function (ace) {
      rep = ace.ace_getRep();
      ace.ace_replaceRange(rep.selStart, rep.selEnd, "E");
      ace.ace_performSelectionChange([rep.selStart[0],rep.selStart[1]-1], rep.selStart, false);
        var val = $("#mathjaxSrc").val();
        var latex = val.replace(/\s/g, '&space;').replace(/\+/g, '&plus;').replace(/#/g, '&hash;');
        ace.ace_performDocumentApplyAttributesToRange(rep.selStart, rep.selEnd, [["mathjax", escape(latex)]]);
    }, "mathjax");
  });

  $("#cancelMathjax").click(function () {
    $("#mathjaxModal").slideUp("fast");
  });
});

function redraw(){
  var val = $("#mathjaxSrc").val();
  var latex = val.replace(/\s/g, '&space;').replace(/\+/g, '&plus;').replace(/#/g, '&hash;');
  url = "http://latex.codecogs.com/gif.latex?"+latex;
  $('#mathjaxPreviewImg').attr("src", url);
}
