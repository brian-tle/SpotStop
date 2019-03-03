class Marker{

    constructor(x,y){
		this.lat = x;
		this.lng = y;
		this.dict = {lat: parseFloat(x), lng: parseFloat(y)};

	}
	 //createmarker(x,y) {
		
		// The map, centered at Uluru
	//	var map = new google.maps.Map(document.getElementById('map'), {zoom: 12, center: this.m});
	//	map.setOptions(mapOptions);
		// The marker, positioned at Uluru
	//	var marker = new google.maps.Marker({position: this.m, map: map,animation:google.maps.Animation.DROP});

		
	//}
	get m() {
		return this.mm();
	}
			
	mm() {
		return this.dict;
	}
    
	
}