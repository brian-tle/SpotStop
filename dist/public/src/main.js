markerList = [];

var mapOptions = {
  streetViewControl: false,
  fullscreenControl: false
};

function initMap() {
  var map = new google.maps.Map(document.getElementById("map"), {
    zoom: 12,
    center: {lat: 37.7219, lng: -122.4782}
  });
  map.setOptions(mapOptions);

  addControls(map);
  addListeners(map);

  getAllMarkers(map);
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
