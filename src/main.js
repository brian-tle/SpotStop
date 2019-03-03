var mapOptions = {
    streetViewControl: false,
    fullscreenControl: false
 };
 
 function initMap() {
    const m = new Marker(37.7219, -122.4782);
    var map = new google.maps.Map(document.getElementById('map'), {zoom: 12, center: m.m});
    map.setOptions(mapOptions);
    // The marker, positioned at Uluru
   
    addControls(map)
    addListeners(map)
 
    m.createMarker(map);
    var marker = m.GetMarker;
    indicator = new MarkerIndicator(marker.getPosition());
    indicator.init(map);
    indicator.addListeners();
 }
 
 function addListeners(map) {
    addListenerControl(map)
 }
 