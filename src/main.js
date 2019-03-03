var cursorRunning = false;

var mapOptions = {
streetViewControl: false,
fullscreenControl: false
};

function CenterControl(controlDiv, map) {
    // Set CSS for the control border.
    var controlUI = document.createElement('div');
    controlUI.style.backgroundColor = '#fff';
    controlUI.style.border = '2px solid #fff';
    controlUI.style.borderRadius = '3px';
    controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
    controlUI.style.cursor = 'pointer';
    controlUI.style.marginBottom = '22px';
    controlUI.style.textAlign = 'center';
    controlUI.title = 'Propose Marker?';
    controlDiv.appendChild(controlUI);
    
    // Set CSS for the control interior.
    var controlText = document.createElement('div');
    controlText.style.color = 'rgb(25,25,25)';
    controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
    controlText.style.fontSize = '16px';
    controlText.style.lineHeight = '38px';
    controlText.style.marginRight = '5px';
    controlText.style.paddingRight = '5px';
    controlText.style.MarginTop = '5px';
    controlText.innerHTML = 'Propose Marker';
    controlUI.appendChild(controlText);
    
    // Setup the click event listeners: transform cursor to red
    controlUI.addEventListener('click', function() {
        cursorRunning = true;
        map.setOptions({ draggableCursor:'url(res/icons/marker_red.png), auto' });
   });
}

function initMap() {
    // The location of Uluru
    var uluru = {lat: 37.7219, lng: -122.4782};
    // The map, centered at Uluru
    var map = new google.maps.Map(document.getElementById('map'), {zoom: 12, center: uluru});
    map.setOptions(mapOptions);
    // The marker, positioned at Uluru
    
    var centerControlDiv = document.createElement('div');
    var centerControl = new CenterControl(centerControlDiv, map);
    
    centerControlDiv.index = 1;
    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(centerControlDiv);
    
    addListeners(map)

    var marker = new google.maps.Marker({position: uluru, map: map});
    indicator = new MarkerIndicator(marker.getPosition());
    indicator.init(map);
}

function addListeners(map) {
	map.addListener('zoom_changed', function() {
		indicator.changeZoom(map.getZoom());
		console.log(map.getZoom());
    });

    map.addListener('click', function(event) {
        if (cursorRunning) {
            marker = new google.maps.Marker({position: event.latLng, map: map});
            map.setOptions({ draggableCursor:'url("https://maps.gstatic.com/mapfiles/openhand_8_8.cur%22), auto' });
            cursorRunning = false;
        }
    });
}