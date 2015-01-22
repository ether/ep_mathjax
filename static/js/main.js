$(document).ready(function () {
  $("#insertEmbedMathjax").click(function () {

    // Not clicking on an existing latex so no lineNumber
    clientVars.plugins.plugins.ep_mathjax.lineNumber = false;

    // bit of a hacky way but works fine
    var module = $("#mathjaxModal");

    if (module.css('display') != "none") {
      module.slideUp("fast");
    } else {
      module.slideDown("fast");
      $('#mathjaxSrc').val("");  // clear input
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
