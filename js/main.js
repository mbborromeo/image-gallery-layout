function checkAllImagesLoaded( $listItems ) {
  let allLoaded = true;

  $listItems.each( function(_, item) {
    const loaded = $(item).data('loaded'); // const loaded = item.hasAttribute('data-loaded'); // $(item).attr('data-loaded')

    if( !loaded ){
      allLoaded = false;
      
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
    $("body").css("background", "none");

    $allLis.each( function(i, item) {
      $(item).delay( i * 150 ).animate( {opacity: 1}, 250 );
    })
  }
}

function onImageLoad( $li ) {
  // set data-loaded flag of corresponding li of loaded image
  $li.data('loaded', true); // $li.attr('data-loaded', true);
  staggerFadeInImages();
}

function onImageError( $li ) {
  // set data-loaded flag of corresponding li of loaded image
  $li.data('loaded', 'error'); //$li.attr('data-loaded', 'error');
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
/*
function jsonFlickrApi( data ){
  console.log("jsonFlickrApi");

  // check if returned data from API call is not OK

  //If status is OK, continue
  buildImageTiles( data.items );
};
*/

function loadPhotos() {
  /*
  $("body").append( 
    $("<script></script>")
      .attr('src', 'https://api.flickr.com/services/feeds/photos_public.gne?format=json&jsoncallback=jsonFlickrApi')
  );
  */

  // use fetch-jsonp imported from CDN https://cdnjs.cloudflare.com/ajax/libs/fetch-jsonp/1.1.3/fetch-jsonp.min.js in index.html file.
  // Resource: https://www.npmjs.com/package/fetch-jsonp
  // current currect call: https://api.flickr.com/services/feeds/photos_public.gne?format=json
  // failed sample: https://www.flickr.com/services/rest/?method=flickr.blogs.getList&format=json&api_key=4151156e60f0f6d624dfa9c224d7cdf8
  // pass sample (not sure why doesn't continue): https://www.flickr.com/services/rest/?method=flickr.test.echo&format=json&api_key=4151156e60f0f6d624dfa9c224d7cdf8
  fetchJsonp('https://api.flickr.com/services/feeds/photos_public.gne?format=json', { // &jsoncallback=jsonFlickrApi
    jsonpCallback: 'jsoncallback' // , 
    // jsonpCallbackFunction: 'jsonFlickrApi'
  }).then( function(response) {
    console.log("response", response)

    if( !response.ok ){
      console.log("JSON API call response not OK", response.ok);
      return; // Exit, do not continue
    } 
    
    return response.json(); 
  }).then( function(json) {
    console.log('parsed successful - json', json);

    if( json.stat === 'fail' ){
      console.log("JSON API call response.json failed", json.stat, json.code, json.message);

      $("body").css("background", "none");
      $("body").text("Error loading images");

      return; // Exit, do not continue
    } 
    
    // return json;
    buildImageTiles( json.items ); // try callback here instead of in URL calling jsonFlickrApi( json )
  }).catch( function(ex) {
    console.log('parsing failed', ex);
  });
}

// document.ready will execute right after the HTML document is loaded property and the DOM is ready
$(document).ready( function() {
  console.log("doc ready");   
});

// wait for the scripts, images to be fully loaded
$(window).on('load', function() {
  console.log("window fully loaded");

  loadPhotos(); 
});
