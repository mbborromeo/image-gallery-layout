$(document).ready(function() {
  // opacity of #image-list is set to 0 initially in CSS file  // $('#image-list').hide();
  $(".image-wrapper").hide();
});

$(window).on( 'load', function() {
  $("body").css("background", "none");  
  $('#image-list').css("opacity", 1); // $('#image-list').show();

  $(".image-wrapper").each( function(i) {
    $(this).delay( (i + 1) * 150 ).fadeIn();
  });
});
