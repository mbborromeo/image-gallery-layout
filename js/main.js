$(document).ready(function() {
  // opacity of #image-list is set to 0 initially in CSS file  // $('#image-list').hide();
  $(".image-wrapper").hide();
});

$(window).on( 'load', function() {
  $("body").css("background", "none");

  $('#image-list').animate( {opacity: 1}, 0, function () {
    $(this).children().each( function(i) { // .image-wrapper
      $(this).delay( (i + 1) * 150 ).fadeIn();
    });
  });
});
