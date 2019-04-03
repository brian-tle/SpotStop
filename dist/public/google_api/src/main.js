markerList = [];
var count;
var list_number;
var map;
// stores the query marker name
var s = [];
// stores query markers lat lng
var m_list = {};
// stores query
var m_l = {};
// stores user rating history
var userList = [];
// stores user marker history
var prof_list = [];
prof_list = profanity_list(prof_list);
var onkey;
var marker_pred;
var deleteToggled = false;
var mapOptions = {
  streetViewControl: false,
  fullscreenControl: false
};

function initialize() {
  initMap();
}

function initMap() {
  // jQuery(document).ready(function () {}) must be
  // used when using $.getJSON() inside the function because
  // $.getJSON() is asynchronous.
  // Since it only works inside jQuery(document).ready(function () {}),
  // all the other code must be added in the given function as well
  jQuery(document).ready(function () {
    // lt = for storing latitude of the IP address
    // lg = for storing longitude of the IP address
    // ip_url = store the url that is used to make API calls
    var lt;
    var lg;
    var ip_url;
    $.getJSON("https://api.ipify.org?format=jsonp&callback=?",
      function (json) {
        ip_url = 'http://api.ipstack.com/' + json.ip + '?access_key=38789675028f4a0492a31fce46e79e55';
        $.getJSON(ip_url, function (data) {
          lt = parseFloat(data.latitude);
          lg = parseFloat(data.longitude);
          // assign default latitude and longitude
          // to the map
          map = new google.maps.Map(document.getElementById("map"), {
            zoom: 12,
            // center == where it stores the default latitude
            // and longitude
            center: { lat: parseFloat(lt), lng: parseFloat(lg) },
            controls: google.maps,
            mapTypeControlOptions: {
              // nothing is inside mapTypeId
              // because we don't want extra features
              // in our map, ex: Sattelite feature
              mapTypeIds: [
              ]
            }
          });
          map.setOptions(mapOptions);
          Marker.map = map;
          addControls(map);
          addListeners(map);
          // retrieve all of the markers in the database
          // and display them on the map
          getAllMarkers(map);
          // call initAutocomplete() to have the search bar
          // working
          initAutocomplete();
          //create account specific controls
          handleAccountType();
        });
      }
    );
  });
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
  map.controls[google.maps.ControlPosition.LEFT_TOP].push(search_div);


// THIS ENABLES THE GOOLE API AUTOCOMPLETE FEATURE
  document.getElementById('all-searches').onchange = function () {
    // IF ALL RADIO BUTTON IS CLICKED
    if (document.getElementById('all-searches').checked == true) {
      list_number = 0;
      // hide the marker search widget
      $('#search_list').hide();
      // reset this count to zero
      count = 0;
      // initialize autocomplete
      search_engine = new google.maps.places.Autocomplete(query);
      // bind the bound so that it will prioritize the search based on the given location
      search_engine.bindTo('bounds', map);
      infowindow = new google.maps.InfoWindow();
      infowindowContent = document.getElementById('infowindow-content');
      infowindow.setContent(infowindowContent);
      // initialize new marker that points to the location results
      marker = new google.maps.Marker({
        map: map,
        icon: 'http://earth.google.com/images/kml-icons/track-directional/track-8.png',
        anchorPoint: new google.maps.Point(0, -29)
      });
      // this enables autocomplete to give user the location of their query
      autcomplete = search_engine.addListener('place_changed', function () {
        infowindow.close();
        marker.setVisible(false);
        place = search_engine.getPlace();
        // IF place doesn't have geometry
        if (!place.geometry) {
          return;
        }
        // IF place has a viewport
        if (place.geometry.viewport) {
          map.fitBounds(place.geometry.viewport);
        }
        // set the map's center view to the give search results' lat and lng
        else {
          map.setCenter(place.geometry.location);
          map.setZoom(13);
        }
        // set search result's lat and lng to the marker
        marker.setPosition(place.geometry.location);
        marker.setVisible(true);
      });
    }
  }


  // THIS ENABLES MARKER SEARCH FEATURE
  document.getElementById('database').onchange = function () {
    // IF MARKER RADIO BUTTON IS CLICKED
    if (document.getElementById('database').checked == true) {
      // if search_engine variable was initialized from All radio search,
      // get rid of it
      if (search_engine) {
        google.maps.event.removeListener(autocomplete);
        google.maps.event.clearInstanceListeners(search_engine);
      }
      // show the search widget list
      // and get rid of the autocomplete widget list
      $('#search_list').show();
      $('.pac-container').remove();
      // make an api call to get all the existing marker's data
      $.getJSON('https://sfhacks2019-1551558382883.appspot.com/getAllMarkers', function (data) {
        marker_pred = data;
      });
      // count is set to zero so that m_l knows which element to store and vice versa
      count = 0;
      // this keeps track of every input changes
      // var i is to keep track the s array
      // var m stores the marker of the given query
      $('#input').on('input', function () {
        var i = 0;
        var m;
        // IF count is still 0 and input value is none,
        // store all the existing markers to m_list
        if (count == 0 || document.getElementById('input').value == '') {
          for (var key in marker_pred) {
            if (marker_pred.hasOwnProperty(key)) {
              // initialize a marker
              m = new google.maps.Marker({
                map: map
              });
              // add a marker to m_list with {marker's name: {lat: value of lat, lng: value of lng}}
              m_list[marker_pred[key].name] = { lat: parseFloat(marker_pred[key].lat), lng: parseFloat(marker_pred[key].lng) };
              // have array s push the name
              s.push(marker_pred[key].name);
              // if the given name hasn't been added to m_l, 
              // ADD THAT NAME
              if (!m_l[s[i]]) {
                m_l[s[i]] = 0;
              }
              // if given query input IS INCLUDED IN MARKER'S NAME AS A SUBSTRING
              if ((s[i] && document.getElementById('input').value != '' || s[i] && document.getElementById('input').value != ' ') && s[i].includes(document.getElementById('input').value)) {
                // value of 0 means that it has not been added to the list tag
                // so it will add it to the list tag. BUT if the value is 1, it means
                // that it was already added to the list tag, so omit
                if (m_l[s[i]] == 0 && list_number < 5) {
                  document.getElementById('search_list').innerHTML += '<li style="width: 300px;list-style-type:none; ">' + '<a href = "javascript:getMarkers(parseFloat(' + m_list[marker_pred[key].name].lat + '), parseFloat(' + m_list[marker_pred[key].name].lng + '))" style="color:black">' + s[i] + '</a>' + '<hr/>' + '</li>';
                  m_l[s[i]] = 1;
                  list_number += 1;

                }
                // if input value is changed, either delete the list tag with irrelevant name
                onkey = $('#input').on('keydown', function (e) {
                  const kk = e.key;
                  if (kk) {
                    document.getElementById('search_list').innerHTML = '';
                    // set all m_l's value back to 0
                    for (var k in m_l) {
                      if (m_l.hasOwnProperty(k)) {
                        m_l[k] = 0;
                        list_number = 0;
                      }
                    }
                  }
                });
              }
              // increment array s's index by 1
              i++;
            }
          }
        }
      });
    }
  }
}

// set the map's center to the given result's latitude and longitude
function getMarkers(x, y) {
  map.setCenter({lat:x, lng:y});
  map.setZoom(25);
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
