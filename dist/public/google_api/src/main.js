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
  var search_engine;
  var search_div = document.getElementById('search-div');
  var query = document.getElementById('input');
  var search_options = document.getElementById('options');
  var infowindow;
  var infowindowContent;
  var marker;
  var place;
  var autocomplete;
  // search_engine is what enables query to access the api
  // make query part of maps control
  map.controls[google.maps.ControlPosition.LEFT_TOP].push(search_div);

  document.getElementById('all-searches').onchange = function () {
    if (document.getElementById('all-searches').checked == true) {
      search_engine = new google.maps.places.Autocomplete(query);

      // bind the bound so that it will prioritize the search based on the given location
      search_engine.bindTo('bounds', map);

      infowindow = new google.maps.InfoWindow();
      infowindowContent = document.getElementById('infowindow-content');
      infowindow.setContent(infowindowContent);
      marker = new google.maps.Marker({
        map: map,
        icon: 'http://earth.google.com/images/kml-icons/track-directional/track-8.png',
        anchorPoint: new google.maps.Point(0, -29)
      });

      autcomplete = search_engine.addListener('place_changed', function () {
        infowindow.close();
        marker.setVisible(false);
        place = search_engine.getPlace();
        if (!place.geometry) {
          return;
        }
        if (place.geometry.viewport) {
          map.fitBounds(place.geometry.viewport);
        }
        else {
          map.setCenter(place.geometry.location);
          map.setZoom(13);
        }
        marker.setPosition(place.geometry.location);
        marker.setVisible(true);
      });
    }
  }
  document.getElementById('database').onchange = function () {
    if (document.getElementById('database').checked == true) {
      google.maps.event.removeListener(autocomplete);
      google.maps.event.clearInstanceListeners(search_engine);
      $('.pac-container').remove();
    }
  }

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
