class Markers{
    constructor(){
	}


	 createmarker(x,y) {
		// The location of Uluru
	   
		var uluru = {lat: x, lng: y};
		// The map, centered at Uluru
		var map = new google.maps.Map(document.getElementById('map'), {zoom: 12, center: uluru});
		map.setOptions(mapOptions);
		// The marker, positioned at Uluru
		var marker = new google.maps.Marker({position: uluru, map: map,animation:google.maps.Animation.DROP});
		
		
	}
	
			
    
	
}