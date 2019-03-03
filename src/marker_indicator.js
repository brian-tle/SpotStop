class MarkerIndicator {
	constructor(latLng) {
		this.latLng = latLng;

		this.x = this.latLng.lat() - (0.001 / 2);
		this.y = this.latLng.lng() - (0.001 / 2);
		this.width = 0.001;
		this.height = 0.001;

		this.updatePolyCoords();

		this.poly = new google.maps.Polygon({
			paths: this.polyCoords,
			strokeColor: '#FF0000',
			strokeOpacity: 1.0,
			strokeWeight: 2,
			fillColor: '#FF0000',
			fillOpacity: 0.75
		});
	}

	updatePolyCoords() {
		this.polyCoords = [
			{lat: this.x, lng: this.y},
			{lat: this.x + this.width, lng: this.y},
			{lat: this.x + this.width, lng: this.y + this.height},
			{lat: this.x, lng: this.y + this.height}
		];
	}

	init(map) {
		this.poly.setMap(map);
	}
}

class UpvoteTriangle {
	constructor(indicator) { 

	}
}