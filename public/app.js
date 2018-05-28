var KEY =
  "Deo8e9rL-9CU0oDhQDVWUYabFzOr_-5P3Zn9uT4qbMOwhT8Ojmk2Dd3gUYTodekMv9laxFylRlKW0SW0BcPix3vdticOH9dOuhRC4fQPCDyrq5mKm9KqFRddgN8GW3Yx";

let map;
function getDataFromYelp(term, location, callback) {
  const settings = {
    url: "/yelp",
    data: {
      location: location,
      term: term,
      limit: 2,
    },
    dataType: 'json',
    type: 'GET',
    success: callback,
    error: function(error) {
      console.log(error);
    }
  };
  $.ajax(settings);
}

//function to render the results to HTML
function renderQueryResults(results) {
 return `
<div class="results-data-card" id="repeat">
  <div class="business-img-container">
    <img class="business-img" src="${results.image_url}" alt="${results.name}"/>
  </div>
  <div class="business-list-details">
    <p class="business business-name">${results.name}</p>
    <p class="business business-desc">${results.location.address1}</p>
    <p class="business business-phone">${results.display_phone}</p>
    <span class="business business-rating-qty">${results.rating}</span>
    <span class="business business-rating-stars" onload="createStarRating(${results.rating});"></span>
    <a class="business business-review-qty">${results.review_count} reviews</a>
    <button role="button" type="submit" class="airbnb-button" value="">Find Airbnb's Nearby</button>
  </div>
</div>`
}

//<img class="business business-rating-stars" onload="this.onload=null; this.src=createStarRating(${results.rating});" src="" alt="rating stars"/>
// Loops through each object in the yelp array data & places it on page2. Also initiates google map call
function displaySearchData(data) {
  console.log("my yelp data is:", data);
  const results = data.businesses.map((item, index) =>
  renderQueryResults(item));
  //getLocationCoordinates(data);
  $('.results-data').html(results);
  $('.page-1').addClass("hidden");
  $('.page-2').removeClass("hidden");
}

// Makes the call to Yelp once the search button has been clicked, resets the query values to empty
function watchSearchButton() {
  $(".search-form").submit(function(event) {
    event.preventDefault();
    let queryTarget = $(event.currentTarget);
    let queryValue = queryTarget.find(".search-data").val();
    let queryLocation = queryTarget.find(".search-loc").val();
    getDataFromYelp(queryValue, queryLocation, displaySearchData);
    queryValue = "";
    queryLocation = "";
  });
}

//Obtains the latitude and longitude coordinates to populate the map
// function getLocationCoordinates(data) {
//   cost locationResults = data.businesses.map((item, index) =>
//   initMap(item)
//  )
// }

// //displays either the map or the results data depending on which arrow is clicked
// function clickArrow() {
//   when the user clicks the right arrow, the listing results will have their class set to hidden
//   and the map will have it's class of hidden removed
// }
//
//google API required constructor function to create map object and center it
function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: {lat: 45.5518025, lng: -122.6559189},
    zoom: 10,
    draggable: true,
    zoomControl: true,
    scrollWheel: false,
    gestureHandling: "greedy"
  });

  // let image='logo.png';
  // let marker = new google.maps.Marker({
  //   position: this.center,
  //   map: map,
  //   icon:image
  // });
}

//document ready functions
$(watchSearchButton);
//$(initmap); //removed it from body tag>> onload="initMap()"
// google.maps.event.addDomListner(window, 'load', initMap);


// takes the rating and rounds it to the nearest half, then fills whole stars and half stars and empty stars using a fontawesome CDN
function createStarRating(rating) {
  let roundedRating = (Math.round(rating * 2) / 2);
  let yellowStars = roundedRating;
  let whiteStars = 5 - roundedRating
   console.log(yellowStars);
   console.log(whiteStars);

  output = '<div title="'+rating+'">';
  output += '<i class="fa fa-star" style="color: gold;">'.repeat(yellowStars);
  output += '<i class="fa fa-star-half-o" style="color: gold;">'.repeat(whiteStars);
  output += '<i class="fa fa-star-o" style="color: gold;">'.repeat(whiteStars);
  //return output + '</div>';
  $('.business-rating-stars').text = output;
}
