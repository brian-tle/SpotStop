var mapOptions = {
    streetViewControl: false,
    fullscreenControl: false
 };
 
 function initMap() {
    const m = new Marker(37.7219, -122.4782);
    const m2 = new Marker(37.7319, -122.4782);
    var map = new google.maps.Map(document.getElementById('map'), {zoom: 12, center: m.m});
    map.setOptions(mapOptions);
    // The marker, positioned at Uluru

    console.log(m);
    console.log(m2);
   
    addControls(map)
    addListeners(map)
 
    m.createMarker(map);
    m2.createMarker(map);
 }
 
 function addListeners(map) {
    addListenerControl(map)
 }
 