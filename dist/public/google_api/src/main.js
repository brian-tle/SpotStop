markerList = [];
var map;
var mapOptions = {
  streetViewControl: false,
  fullscreenControl: false
};

function initialize() {
  initMap();
  initAutocomplete();
}

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 12,
    center: {lat: 37.7219, lng: -122.4782},
    controls: google.maps,
    mapTypeControlOptions: {      
      mapTypeIds: [
        google.maps.MapTypeId.ROADMAP,
        google.maps.MapTypeId.SATELLITE
      ]
    }
  });
  map.setOptions(mapOptions);

  Marker.map = map;

  addControls(map);
  addListeners(map);

  getAllMarkers(map);
}

function initAutocomplete() {

  // query is essentially an input tag w/ the search box
  var query = document.getElementById('pac-input');
  // search_engine is what enables query to access the api
  var search_engine = new google.maps.places.SearchBox(query);
  // make query part of maps control
  map.controls[google.maps.ControlPosition.LEFT_TOP].push(query);


  // search_engine results will change based on current map's viewport.
  map.addListener('bounds_changed', function () {
    search_engine.setBounds(map.getBounds());
  });

  var markers = [];
  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  search_engine.addListener('places_changed', function () {
    // getPlaces() returns arrays of predicted places
    // essentially var places = array of predicted places
    var places = search_engine.getPlaces();

    // returns nothing if there are no predicted places
    if (places.length == 0) {
      return;
    }

    // Clear out the old markers.
    // Pretty self-explanatory
    markers.forEach(function (marker) {
      marker.setMap(null);
    });
    markers = [];

    // For each place, get the icon, name and location.
    var bounds = new google.maps.LatLngBounds();

    // this works because var places is an array
    places.forEach(function (place) {
      // I guess this means that if the predicted places has no geometry
      if (!place.geometry) {
        console.log("Returned place contains no geometry");
        return;
      }

      // Create a marker for each place.
      markers.push(new google.maps.Marker({
        map: map,
        icon: 'http://earth.google.com/images/kml-icons/track-directional/track-8.png',
        title: place.name,
        // stores lat lng of the place
        position: place.geometry.location
      }));

      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    map.fitBounds(bounds);
  });
}


function addListeners(map) {
  addListenerControl(map);
}

// Front-End JavaScript
// Select DOM Items
const menuBtn = document.querySelector(".menu-btn");
const menu = document.querySelector(".menu");
const menuNav = document.querySelector(".menu-nav");
const menuBranding = document.querySelector(".menu-branding");
const navItems = document.querySelectorAll(".nav-item");

// Set Initial State Of Menu
let showMenu = false;

menuBtn.addEventListener("click", toggleMenu);

function toggleMenu() {
  if (!showMenu) {
    menuBtn.classList.add("close");
    menu.classList.add("show");
    menuNav.classList.add("show");
    menuBranding.classList.add("show");
    navItems.forEach(item => item.classList.add("Show"));

    // Set Menu State
    showMenu = true;
  } else {
    menuBtn.classList.remove("close");
    menu.classList.remove("show");
    menuNav.classList.remove("show");
    menuBranding.classList.remove("show");
    navItems.forEach(item => item.classList.remove("Show"));

    // Set Menu State
    showMenu = false;
  }
}

// Get modal element
var modal = document.getElementById("simpleModal");

// Get open modal button
var modalBtn = document.getElementById;
