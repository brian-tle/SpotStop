function initMap() {
  // The location of Uluru
  var uluru = {lat: 37.773972, lng: -122.431297};
  // The map, centered at Uluru
  var map = new google.maps.Map(
      document.getElementById('map'), {zoom: 12, center: uluru});
  // The marker, positioned at Uluru
  var marker = new google.maps.Marker({position: uluru, map: map});
}