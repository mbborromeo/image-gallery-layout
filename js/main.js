function onImageLoad( $li ) {
  // set current li to loaded data attribute
  $li.attr('data-loaded', true);

  const allLis = $("#image-list li");

  // check all items for all images loaded
  let allLoaded = true; // initially set to true in case images cached
  allLis.each( function(i, item) { // (_, item)
    if (!$(item).attr('data-loaded')) {
      //console.log("not loaded - ", i)

      allLoaded = false;
      return false; // exit forEach loop if a list item has not loaded its image
    }
  })

  if (allLoaded) {
    //console.log("allLoaded")

    allLis.each( function(i, item) {
      $(item).delay( (i + 1) * 150 ).animate( {opacity: 1}, 250 );
    })
  }
}

function buildImageTiles( flickrPhotos ){  
  const $imageList = $("#image-list"); // const $imageList = $("<ul id='image-list'></ul>");

  //dynamically build the content for the image tiles
  flickrPhotos.forEach( function (currentItem, i) {
      console.log("flickrPhotos.forEach ", i)

      $imageList.append( 
        $('<li></li>')
        .addClass("image-wrapper")
        .attr("data-id", i)
        .append( 
          $('<figure></figure>')
            .append(
              $('<img />')
                .attr('src', currentItem.media.m)
                .attr('alt', 'image ' + i)
                .on('load', function () { // on image load, fade-in list item (its parent)
                  console.log('image '+ i + ' loaded');
                  // $(this).parent().parent().animate( {opacity: 1}, 250 ); // .delay( (i + 1) * 150 ) before animate
                  onImageLoad( $(this).parent().parent() );
                })
            )
            .append(
              $('<figcaption></figcaption>')
                .html( currentItem.title + '<br />' + currentItem.date_taken )
            )
        )
      );      
  }); 

  // $("body").append( $imageList );
}

//Load JSON from Flickr API call on index.html page
function jsonFlickrApi( data ){
  console.log("jsonFlickrApi")

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
  console.log("set up")

  const $loadScript = $("<script src='https://api.flickr.com/services/feeds/photos_public.gne?format=json&jsoncallback=jsonFlickrApi'></script>");
  $("body").append( $loadScript );
}

// document.ready will execute right after the HTML document is loaded property and the DOM is ready.
$(document).ready( function() {
  console.log("document ready")

  // opacity of .image-wrapper is set to 0 initially in CSS file
  setUp();  
});

// window.load however will wait for the page to be fully loaded, this includes inner frames, images, scripts, objects, etc.
$(window).on( 'load', function() {
  console.log("window loaded")
  $("body").css("background", "none");
});
