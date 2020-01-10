function checkAllImagesLoaded( $listItems ) {
  let allLoaded = true;

  $listItems.each( function(_, item) {
    console.log('each index', _)

    let loaded = $(item).attr('data-loaded');

    if( !loaded ){
      console.log("IMG", _, "not loaded!")

      allLoaded = false;
      console.log("allLoaded:", allLoaded)
      
      return false; // exit forEach loop if a list item has not loaded its image
    }
  });

  return allLoaded;    
}

function staggerFadeInImages() {
  // lookup all list items
  const $allLis = $("#image-list li");

  // if all images have loaded, fade-in images in sequential order
  // opacity of .image-wrapper is set to 0 initially in CSS file
  if( checkAllImagesLoaded( $allLis ) ){
    console.log("all images loaded")

    $("body").css("background", "none");

    $allLis.each( function(i, item) {
      $(item).delay( i * 150 ).animate( {opacity: 1}, 250 );
    })
  }
}

function onImageLoad( $li ) {
  // set data-loaded flag of corresponding li of loaded image
  $li.attr('data-loaded', true);
  staggerFadeInImages();
}

function onImageError( $li ) {
  // set data-loaded flag of corresponding li of loaded image
  $li.attr('data-loaded', 'error');
  staggerFadeInImages();
}

function buildImageTiles( flickrPhotos ){  
  const $imageList = $("#image-list"); // const $imageList = $("<ul id='image-list'></ul>");

  // dynamically build the content for the image tiles
  flickrPhotos.forEach( function (currentItem, i) {
      $imageList.append( 
        $('<li></li>')
        .addClass("image-wrapper")
        .data("id", i)
        .append( 
          $('<figure></figure>')
            .append(
              $('<img />')
                .attr('src', currentItem.media.m)
                .attr('alt', 'image ' + i)
                .on('load', function () {
                  console.log('image', i, 'loaded');
                  onImageLoad( $(this).parent().parent() );
                })
                .on('error', function () {
                  console.log('image', i, 'error loading');
                  onImageError( $(this).parent().parent() );
                })
            )
            .append(
              $('<figcaption></figcaption>')
                .html( currentItem.title + '<br />' + currentItem.date_taken )
            )
        )
      );      
  }); 
}

// handle response of load from Flickr API call
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

function loadPhotos() {
  $("body").append( 
    $("<script></script>")
      .attr('src', 'https://api.flickr.com/services/feeds/photos_public.gne?format=json&jsoncallback=jsonFlickrApi')
  );
}

// document.ready will execute right after the HTML document is loaded property and the DOM is ready.
$(document).ready( function() {
  loadPhotos();  
});
