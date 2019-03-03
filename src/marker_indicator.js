class MarkerIndicator {
	constructor(latLng) {
		this.latLng = latLng;

		this.x = this.latLng.lat() - (0.01 / 2);
		this.y = this.latLng.lng() - (0.01 / 2);
		this.width = 0.01;
		this.height = 0.01;

		this.updatePolyCoords();

		this.poly = new google.maps.Polygon({
			paths: this.polyCoords,
			strokeColor: '#FF0000',
			strokeOpacity: 0.8,
			strokeWeight: 2,
			fillColor: '#FF0000',
			fillOpacity: 0.35
		});
	}

	changeZoom(zoomVal) {
		if (zoomVal > 12) {
			this.x = this.latLng.lat() - (0.01 / (13 - zoomVal) / 2);
			this.y = this.latLng.lng() - (0.01 / (13 - zoomVal) / 2);
			this.width = (0.01 / (13 - zoomVal));
			this.height = (0.01 / (13 - zoomVal));
		}
		else {
			if (zoomVal < 12) {
				this.x = this.latLng.lat() - (0.01 * (13 - zoomVal) / 2);
				this.y = this.latLng.lng() - (0.01 * (13 - zoomVal) / 2);
				this.width = (0.01 * (13 - zoomVal));
				this.height = (0.01 * (13 - zoomVal));
			}
			else {
				this.x = this.latLng.lat() - (0.01 / 2);
				this.y = this.latLng.lng() - (0.01 / 2);
				this.width = 0.01;
				this.height = 0.01;
			}
		}
		this.updatePolyCoords();
		this.poly.setPath(this.polyCoords);
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