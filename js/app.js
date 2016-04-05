//Problem: User when clicking on image goes to a dead end, poor UX
//Solution: Create an overlay with the large image - Lightbox

var $overlay = $('<div id="overlay"><div></div></div>');
var $image = $("<img>");
var $caption = $("<p></p>");

//Keep track of image index for prev/next, we will use a list index
//position to determine where we are and what it means to move forward
//and backwards by 1.
var $index = 0;

//this is grabbing the list items from the imageGallery element and
//we are assigning the length total
//this makes it flexible to expand the gallery or take away
var $galleryLength = $("#imageGallery li").length;

//2.1 Add image
$overlay.children("div").append($image);

//2.2 add caption
$overlay.children("div").append($caption);

// Add some nav buttons and assign unique ids to them!
$overlay.children("div").append("<button id='btnPrev'> < </button>");
$overlay.children("div").append("<button id='btnNext'> > </button>");
$overlay.children("div").append("<button id='btnClose'> x </button>");

// Add overlay
$("body").append($overlay);

// Update image overlay
// I moved the updating of the overlay to its own function
// since we use it three times in three differnet area, this makes code
// writting cleaner
var updateImage = function(imageLocation, imageCaption){

  //update the overlay with the image linked in the link
  $image.attr("src", imageLocation);

  //Get child <img> alt atrbute and set caption
  $caption.text(imageCaption);
}

//Click <a> event to an image
$("#imageGallery a").click(function(event){
  event.preventDefault();
  var imageLocation = $(this).attr("href");
  var imageCaption =  $(this).children("img").attr("alt");

  //update index to current selected image
  $index = $(this).parent().index(); 

  //this is calling that new Update overlay function above
  updateImage(imageLocation, imageCaption);

  //Show the overlay
  $overlay.slideDown(imageLocation);


});

//Button prev next function
var prevNext = function(prev ) {
  //set prev to true to move backwards in the index

  //if flag set move backwards, if not move forwards
  if(!prev) { $index++; }
  else { $index--; }

  //if out of index reset
  if ($index < 0) { $index = $galleryLength-1;}
  if ($index > 11) { $index = 0; }

  //Grab the element by index and then get the link
  var newImgSelected = $("#imageGallery li").get($index).getElementsByTagName("a");

  //grab link information
  var imageLocation = $(newImgSelected).attr("href");
  var imageCaption =  $(newImgSelected).children("img").attr("alt");

  //Update Overlay
  updateImage(imageLocation, imageCaption);
}

// Hide Overlay function
function hideOverlay() {
  $overlay.hide();
}
//Button events

$("#btnPrev").click(function(event){
  prevNext(true);
});

$("#btnNext").click(function(event){
  prevNext();
});

// Exit button
$("#btnClose").click(function(){
    hideOverlay();
});

//When overlay is click
$overlay.click(function(event){
  // Hide the overlay  
    if(event.target.id == "overlay")
    $(this).slideUp("fast");
    hideOverlay;
});

// Keyboard navigation
$("body").on("keydown", function(k) {

  // on right or down arrow
  if(k.keyCode === 39 || k.keyCode === 40 ) {
    prevNext();
  }

  // on left arrow or up arrow
  if(k.keyCode === 37 || k.keyCode === 38 ) {
    prevNext(true);
  }

  // on escape or end
  if(k.keyCode === 27 || k.keyCode === 35 ) {
    hideOverlay();
  }

});

// Search Function
(function() {                                     // Lives in an IIFE
  var $imgs = $('#imageGallery img');             // Get the images
  var $search = $('#search');                     // Get the input element
  var cache = [];                                 // Create an array called cache

  $imgs.each(function() {                         // For each image
    cache.push({                                  // Add an object to the cache array
      element: this,                              // This image
      text: this.alt.trim().toLowerCase()         // Its alt text (lowercase trimmed)
    });
  });

  function filter() {                             // Declare filter() function
    var query = this.value.trim().toLowerCase();  // Get the query
    cache.forEach(function(img) {                 // For each entry in cache pass image 
      var index = 0;                              // Set index to 0

      if (query) {                                // If there is some query text
        index = img.text.indexOf(query);          // Find if query text is in there
      }

      img.element.style.display = index === -1 ? 'none' : '';  // Show / hide
    });
  }

  if ('oninput' in $search[0]) {                   // If browser supports input event
    $search.on('input', filter);                   // Use input event to call filter()
  } else {                                         // Otherwise
    $search.on('keyup', filter);                   // Use keyup event to call filter()
  }              

}());