class Marker{

    constructor(x,y){
		this.lat = x;
		this.lng = y;
		this.default = {lat: parseFloat(x), lng: parseFloat(y)};
		this.marker;
		this.list=[];	}
	 //createmarker(x,y) {
		
		// The map, centered at Uluru
	//	var map = new google.maps.Map(document.getElementById('map'), {zoom: 12, center: this.m});
	//	map.setOptions(mapOptions);
		// The marker, positioned at Uluru
	//	var marker = new google.maps.Marker({position: this.m, map: map,animation:google.maps.Animation.DROP});

		
	//}
	addlsit(marker){
		this.list = list;
		list.push(marker);

	}
	get m() {
		return this.mm();
	}
			
	mm() {
		return this.default;
	}

	createMarker(map) {
		this.marker = new google.maps.Marker({position: this.default,animation: google.maps.Animation.DROP, map:map});
	}
	
	get GetMarker() {
		return this.GetM();
	}

	GetM() {
		return this.marker;
	}
	get Getlist(){
		return this.getL();
	}
	GetL(){
		return this.list;
	}
	
}