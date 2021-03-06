let map;
let infoWindow;

//Makes the call to Yelp once the search button has been clicked, resets the query values to empty
function watchSearchButton() {
  $('.search-form').submit(function(event) {
    event.preventDefault();
    let queryTarget = $(event.currentTarget);
    let queryValue = queryTarget.find('.search-data').val();
    let queryLocation = queryTarget.find('.search-loc').val();
    getDataFromYelp(queryValue, queryLocation, displaySearchData);
    queryValue = '';
    queryLocation = '';
  });
}

//Request object for Yelp API
function getDataFromYelp(term, location, callback) {
  const settings = {
    url: '/yelp',
    data: {
      location: location,
      term: term,
      limit: 50
    },
    dataType: 'json',
    type: 'GET',
    success: callback,
    error: function(error) {
      console.log(error);
      if(error.status==400) {
        $('.error-message-container').text('Unfortunately, we dont have data for this location, please select a different location');
        $('.error-message-container').css('background-color', 'white');
      }
    }
  };
  $.ajax(settings);
}

//Callback function that loops through each object in the Yelp data object & places it on page2
function displaySearchData(data) {
  initMap(data);
  const singleBusiness = data.businesses.map(item => renderQueryResults(item));
  const markers = data.businesses.forEach(business => createMarker(business));
  $('.results-data').html(singleBusiness);
  $('.page-1').addClass('hidden');
  $('.page-2').removeClass('hidden');
}

//Renders the business data results to HTML
function renderQueryResults(business) {
  return `
  <div class="results-data-card">
  <div class="business-img-container">
  <img class="business-img" src="${business.image_url}" alt="${business.name}"/>
  </div>
  <div class="business-list-details">
  <p class="business business-name">${business.name}</p>
  <p class="business business-desc">${business.location.address1}</p>
  <p class="business business-phone">${business.display_phone}</p>
  <span class="business business-rating-qty">${business.rating}</span>
  <span class="business business-stars">${createStarRating(
    business.rating
  )}</span>
  <a class="business business-review-qty">${business.review_count} reviews</a>
  <button role="button" type="button" class="airbnb-button" value="${
    business.location.city
  }--${business.location.state}-${
    business.location.zip_code
  }">Find Airbnb's Nearby</button>
  </div>
  </div>`;
}

//Takes the business rating & determines how to fill (full, half, empty) the stars using fontawesome CDN
function createStarRating(rating) {
  let fullStars = Math.floor(rating);
  let halfStars = rating % 1 < 1 && rating % 1 > 0 ? 1 : 0;
  let emptyStars = 5 - (fullStars + halfStars);
  output = '<i class="fa fa-star" style="color: gold;"></i>'.repeat(fullStars);
  output += '<i class="fa fa-star-half-o" style="color: gold;"></i>'.repeat(
    halfStars
  );
  output += '<i class="fa fa-star-o" style="color: gold;"></i>'.repeat(
    emptyStars
  );
  return output;
}

//Google API constructor function to create map object and center it
function initMap(data) {
  let lat = data.region.center.latitude;
  let lng = data.region.center.longitude;
  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: lat, lng: lng },
    zoom: 10,
    draggable: true,
    zoomControl: true,
    scrollWheel: false,
    gestureHandling: 'greedy'
  });
  infoWindow = new google.maps.InfoWindow({
    content: '' ,
    maxWidth: 200
  });
}

//Google API constructor for making map markers and adding event listeners for user actions with markers
function createMarker(business) {
  let marker = new google.maps.Marker({
    position: {
      lat: business.coordinates.latitude,
      lng: business.coordinates.longitude
    },
    map: map,
    title: business.name
  });
  function openInfoBox() {
    infoWindow.open(map, marker);
    infoWindow.setContent(renderMapMarkerBox(business));
  }
  marker.addListener('click', openInfoBox);
  marker.addListener('mouseover', openInfoBox);
}

//Renders the business info box for the map markers
function renderMapMarkerBox(business) {
  return `
  <div class="marker-results-data-card">
  <div class="marker-business-img-container">
  <img class="marker-business-img" src="${business.image_url}" alt="${business.name}"/>
  </div>
  <div class="marker-business-list-details">
  <p class="marker-business marker-business-name">${business.name}</p>
  <p class="marker-business marker-business-desc">${business.location.address1}</p>
  <p class="marker-business marker-business-phone">${business.display_phone}</p>
  <span class="marker-business marker-business-rating-qty">${business.rating}</span>
  <span class="marker-business marker-business-stars">${createStarRating(business.rating)}</span>
  <a class="marker-business marker-business-review-qty">${business.review_count} reviews</a>
  </div>
  <button role="button" type="button" class="marker-airbnb-button" value="${business.location.city
  }--${business.location.state}-${business.location.zip_code}">Find Airbnb's Nearby</button>
  </div>`;
}

//Displays either the map or the results data depending on which button is clicked
function arrowButtonListeners() {
  $('#map-arrow').click(function() {
    $('.results-container').animate({width: 'toggle'}, 300);
    $('#left-arrow').removeClass('hidden');
  });

  $('.nav-arrow-container-2').click(function() {
    $('.results-container').animate({width: 'toggle'}, 300);
    $('#left-arrow').addClass('hidden');
  });
}

//Allows users to click on navigation and take them to the section on page1
function navLinksListeners() {
  $('.nav-link').click(function() {
    $('.page-2').addClass('hidden');
    $('.page-1').removeClass('hidden');
  })
}

//When AirBnB buttons are clicked, the callback is run
function findAirbnbs() {
  $('.results-data').on('click', '.airbnb-button', findAirbnbsCallback);
  $('.map-container').on('click', '.marker-airbnb-button',findAirbnbsCallback);
}

//Takes you to Airbnb site with home search results based on location from click above
function findAirbnbsCallback(event) {
  event.preventDefault;
  let searchLoc = $(this).attr('value');
  window.open(`https://www.airbnb.com/s/${searchLoc}/homes`);
}

//Document ready functions for Jquery
$(function() {
  watchSearchButton();
  arrowButtonListeners();
  navLinksListeners();
  findAirbnbs();
});
