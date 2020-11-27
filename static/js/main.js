$(document).ready(() => {
  $('.ep_mathjax .buttonicon').click(() => {
    // Not clicking on an existing latex so no lineNumber
    clientVars.plugins.plugins.ep_mathjax.lineNumber = false;

    // bit of a hacky way but works fine
    const module = $('#mathjaxModal');
    if (module.hasClass('popup-show')) {
      $('#mathjaxModal').removeClass('popup-show');
    } else {
      $('#mathjaxModal').addClass('popup-show');
      $('#mathjaxSrc').val(''); // clear input
      redraw();
    }
  });

  $('#mathjaxSrc').on('change keyup paste', () => {
    redraw();
  });

  $('#mathsymbols').on('change', function () {
    const val = $(this).val();
    const title = $(this).find('option:selected').attr('title');
    $('#mathjaxSrc').val($('#mathjaxSrc').val() + title);
    $('#mathjaxSrc').change();
  });

  $('#greeksymbols').on('change', function () {
    const val = $(this).val();
    const title = $(this).find('option:selected').attr('title');
    $('#mathjaxSrc').val($('#mathjaxSrc').val() + title);
    $('#mathjaxSrc').change();
  });

  $('#cancelMathjax').click(() => {
    $('#mathjaxModal').removeClass('popup-show');
  });
});

function redraw() {
  const val = $('#mathjaxSrc').val();
  const latex = val.replace(/\s/g, '&space;').replace(/\+/g, '&plus;').replace(/#/g, '&hash;');
  url = `${window.location.protocol}//latex.codecogs.com/gif.latex?${latex}`;
  $('#mathjaxPreviewImg').attr('src', url);
}
