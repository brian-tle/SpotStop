class MarkerIndicator {
	constructor(latLng) {
		this.x = latLng.lat() - (0.001 / 2);
		this.y = latLng.lng() - (0.001 / 2);
		this.width = 0.001;
		this.height = 0.001;
	}

	init(map) {
		this.polyCoords = [
			{lat: this.x, lng: this.y},
			{lat: this.x + this.width, lng: this.y},
			{lat: this.x + this.width, lng: this.y + this.height},
			{lat: this.x, lng: this.y + this.height}
		];

		// Construct the polygon.
		this.poly = new google.maps.Polygon({
			paths: this.polyCoords,
			strokeColor: '#FF0000',
			strokeOpacity: 0.8,
			strokeWeight: 2,
			fillColor: '#FF0000',
			fillOpacity: 0.35
		});

		this.poly.setMap(map);
	}
}