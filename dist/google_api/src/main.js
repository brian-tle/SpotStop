markerList = [];

var mapOptions = {
  streetViewControl: false,
  fullscreenControl: false
};
/* // Message to Will:
// I just commented out four default constructors to avoid creating extra documents
 */
function initMap() {
  markerList.push(new Marker(37.7219, -122.4782));
/*   markerList.push(new Marker(37.7319, -122.4882, 12));
  markerList.push(new Marker(37.8271, -122.4216, 46));
  markerList.push(new Marker (37.7928, -122.4834, 37));
    markerList.push(new Marker (37.7768, -122.4239, 23)); */
  var map = new google.maps.Map(document.getElementById("map"), {
    zoom: 12,
    center: markerList[0].m
  });
  map.setOptions(mapOptions);

  addControls(map);
  addListeners(map);

  markerList[0].createMarker(map);
  markerList[1].createMarker(map);
  markerList[2].createMarker(map);
  markerList[3].createMarker(map);
  markerList[4].createMarker(map);
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
