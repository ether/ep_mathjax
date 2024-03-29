'use strict';

const redraw = () => {
  // latex.codecogs.com does NOT use application/x-www-form-urlencoded for the query string. In
  // particular, a `+` character is interpreted as a plus, not a space.
  const url = `https://latex.codecogs.com/gif.latex?${encodeURIComponent($('#mathjaxSrc').val())}`;
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
