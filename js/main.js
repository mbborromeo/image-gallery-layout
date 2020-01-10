function onImageLoad( $li ) {
  // set current li to loaded data attribute
  $li.data('loaded', true);

  // lookup all list items
  const allLis = $("#image-list li");

  // check whether images of all items have been loaded
  let allLoaded = true;
  allLis.each( function(_, item) {
    if (!$(item).data('loaded')) {
      console.log('each', _)
      allLoaded = false;
      return false; // exit forEach loop if a list item has not loaded its image
    }
  })

  // if all images have loaded, fade-in images in sequential order
  // opacity of .image-wrapper is set to 0 initially in CSS file
  if (allLoaded) {
    $("body").css("background", "none");

    allLis.each( function(i, item) {
      $(item).delay( i * 150 ).animate( {opacity: 1}, 250 );
    })
  }
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
                  console.log('image '+ i + ' loaded');
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
