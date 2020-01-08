function buildImageTiles( flickrPhotos ){
  // let $imageList = $("<ul id='image-list'></ul>");
  const $imageList = $("#image-list");

  //dynamically build the content for the image tiles
  flickrPhotos.forEach( function (currentItem, i) {
      /*
      newItem = '<li class="image-wrapper" data-id="' + i + '">' +
                      '<figure>' +
                        '<img src="'+ currentItem.media.m +'" alt="image '+ i +'" />' + 
                        '<figcaption>' + 
                          currentItem.title + '<br />' + currentItem.date_taken +
                        '</figcaption>' +
                      '</figure>' +
                    '</li>';
      */
      const $listItem = $('<li></li>')
        .addClass("image-wrapper")
        .data("id", i);

      const $figure = $('<figure></figure>');

      const $image = $('<img />')
        .attr('src', currentItem.media.m)
        .attr('alt', 'image ' + i);

      // on image load, fadeIn image/list item

      const $figCaption = $('<figcaption></figcaption>')
        .html( currentItem.title + '<br />' + currentItem.date_taken );

      $figure
        .append( $image )
        .append( $figCaption);

      $listItem.append( $figure );

      $imageList.append( $listItem );
  }); 

  // $("body").append( $imageList );
}

//Load JSON from Flickr API call on index.html page
function jsonFlickrApi( data ){
  //To Do: Possible check if returned data from API call is not OK
  /*
  if(data.stat != "ok"){
    console.log("Error reading JSON API call");
    return; //Exit, do not continue
  }
  */

  //If status is OK, continue
  buildImageTiles( data.items );
};

function setUp() {
  const $loadScript = $("<script src='https://api.flickr.com/services/feeds/photos_public.gne?format=json&jsoncallback=jsonFlickrApi'></script>");
  $("body").append( $loadScript );
}

// document.ready will execute right after the HTML document is loaded property and the DOM is ready.
$(document).ready(function() {
  console.log("document ready")

  setUp();

  // opacity of #image-list is set to 0 initially in CSS file     // $('#image-list').hide();
  // opacity of .image-wrapper is set to 0 initially in CSS file  // $(".image-wrapper").hide();
});

// window.load however will wait for the page to be fully loaded, this includes inner frames, images, scripts, objects, etc.
$(window).on( 'load', function() {
  console.log("window loaded")
  $("body").css("background", "none");

  //fade in
  /* 
  $('#image-list').animate( {opacity: 1}, 0, function () {
    console.log( $(this).children().length );

    $(this).children().each( function(i) { // equivalent to .image-wrapper
      $(this).delay( (i + 1) * 150 ).animate( {opacity: 1}, 250 ); // .fadeIn()
    });
  });  
  */

});
