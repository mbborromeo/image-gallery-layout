let flickrPhotos = undefined;

function buildImageTiles(){
  let imagesArray = new Array();

  //Preload images into array and dynamically build the content for the image tiles
  flickrPhotos.forEach( function (currentItem, i) {        
      imagesArray[i] = new Image();
      imagesArray[i].src = currentItem.media.m; //m is for mobile-sized Flickr image
      let newContent = "";    

      newContent = '<li class="image-wrapper" data-id="' + i + '">' +
                      '<figure>' +
                        '<img src="'+ imagesArray[i].src +'" alt="image '+ i +'" />' + 
                        '<figcaption>' + 
                          currentItem.title + '<br />' + currentItem.date_taken +
                        '</figcaption>' +
                      '</figure>' +
                    '</li>';

      //Update page with built image tile
      $("#image-list").append( newContent );
  }); 
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
  flickrPhotos = data.items;
  
  //Build image tiles
  buildImageTiles();    
};

function setUp() {
  const $loadScript = $("<script src='https://api.flickr.com/services/feeds/photos_public.gne?format=json&jsoncallback=jsonFlickrApi'></script>");
  $("body").append( $loadScript );
}

// document.ready will execute right after the HTML document is loaded property and the DOM is ready.
$(document).ready(function() {
  setUp();

  // opacity of #image-list is set to 0 initially in CSS file  // $('#image-list').hide();
  $(".image-wrapper").hide();
});

// window.load however will wait for the page to be fully loaded, this includes inner frames, images, etc.
$(window).on( 'load', function() {
  $("body").css("background", "none");

  //fade in
  $('#image-list').animate( {opacity: 1}, 0, function () {
    $(this).children().each( function(i) { // .image-wrapper
      $(this).delay( (i + 1) * 150 ).fadeIn();
    });
  });  
});
