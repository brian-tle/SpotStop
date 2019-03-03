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

    var marker = new google.maps.Marker({position: m.m, map: map});
    indicator = new MarkerIndicator(marker.getPosition());
    indicator.init(map);
    indicator.addListeners();
}

function addListeners(map) {
    addListenerControl(map)
}