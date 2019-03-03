<<<<<<< HEAD
function createmarker(x,y) {
	// The location of Uluru
   
    var uluru = {lat: x, lng: y};
	// The map, centered at Uluru
	var map = new google.maps.Map(document.getElementById('map'), {zoom: 12, center: uluru});
	map.setOptions(mapOptions);
	// The marker, positioned at Uluru
	var marker = new google.maps.Marker({position: uluru, map: map});
	
    
}
=======
class Marker {
    constructor(x, y) {
        markerList = [
            {
            position: new google.maps.LatLng(x, y),
                type: 'info'
            },
        ]
    }
}
>>>>>>> c6acd2897767a5df78d2db286ea19f9a9d69b99b
