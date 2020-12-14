'use strict';

const redraw = () => {
  const val = $('#mathjaxSrc').val();
  const latex = val.replace(/\s/g, '&space;').replace(/\+/g, '&plus;').replace(/#/g, '&hash;');
  const url = `${window.location.protocol}//latex.codecogs.com/gif.latex?${latex}`;
  $('#mathjaxPreviewImg').attr('src', url);
};

$(document).ready(() => {
  $('li > .ep_mathjax').click(() => {
    // Not clicking on an existing latex so no lineNumber
    clientVars.plugins.plugins.ep_mathjax.lineNumber = false;

    $('#mathjaxModal').addClass('popup-show');
    // redraw();
  });

  $('#mathjaxSrc').on('change keyup paste', () => {
    redraw();
  });

  $('#mathsymbols').on('change', function () {
    const title = $(this).find('option:selected').attr('title');
    $('#mathjaxSrc').val($('#mathjaxSrc').val() + title);
    $('#mathjaxSrc').change();
  });

  $('#greeksymbols').on('change', function () {
    const title = $(this).find('option:selected').attr('title');
    $('#mathjaxSrc').val($('#mathjaxSrc').val() + title);
    $('#mathjaxSrc').change();
  });

  $('#cancelMathjax').click(() => {
    $('#mathjaxModal').removeClass('popup-show');
  });
});
