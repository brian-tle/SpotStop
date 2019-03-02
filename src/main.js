var mapOptions = {
	streetViewControl: false
};

function initMap() {
	// The location of Uluru
	var uluru = {lat: 37.7219, lng: -122.4782};
	// The map, centered at Uluru
	var map = new google.maps.Map(document.getElementById('map'), {zoom: 12, center: uluru});
	map.setOptions(mapOptions);
	// The marker, positioned at Uluru
	var marker = new google.maps.Marker({position: uluru, map: map});
}