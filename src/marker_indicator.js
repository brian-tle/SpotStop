class MarkerIndicator {
	constructor(latLng) {
		this.latLng = latLng;

		this.x = this.latLng.lat() - (0.001 / 2);
		this.y = this.latLng.lng() - (0.001 / 2);
		this.width = 0.001;
		this.height = 0.001;

		this.polyCoords = [
			{lat: this.x, lng: this.y},
			{lat: this.x + this.width, lng: this.y},
			{lat: this.x + this.width, lng: this.y + this.height},
			{lat: this.x, lng: this.y + this.height}
		];

		this.poly = new google.maps.Polygon({
			paths: this.polyCoords,
			strokeColor: '#FF0000',
			strokeOpacity: 1.0,
			strokeWeight: 2,
			fillColor: '#FF0000',
			fillOpacity: 0.75
		});

		this.upvote = new UpvoteTriangle(this);
		this.downvote = new DownvoteTriangle(this);
	}

	addListeners() {
		this.upvote.addListeners();
		this.downvote.addListeners();
	}

	init(map) {
		this.poly.setMap(map);
		this.upvote.init(map);
		this.downvote.init(map);
	}
}

class UpvoteTriangle {
	constructor(indicator) { 
		this.indicator = indicator;
		this.notVotedColor = '#474747';
		this.votedColor = '#46db46';

		this.polyCoords = [
			{lat: indicator.x + (indicator.width * .80), 	lng: indicator.y},
			{lat: indicator.x + (indicator.width), 			lng: indicator.y + (indicator.height / 8)},
			{lat: indicator.x + (indicator.width * .80), 	lng: indicator.y + (indicator.height / 4)},
		];

		this.poly = new google.maps.Polygon({
			paths: this.polyCoords,
			strokeColor: '#000000',
			strokeOpacity: 1.0,
			strokeWeight: 2,
			fillColor: '#46db46',
			fillOpacity: 1.0
		});
	}

	addListeners() {
		this.poly.addListener('click', function(event) {

	    });
	}

	init(map) {
		this.poly.setMap(map);
	}
}

class DownvoteTriangle {
	constructor(indicator) { 
		this.indicator = indicator;
		this.notVotedColor = '#474747';
		this.votedColor = '#FF0000';

		this.polyCoords = [
			{lat: indicator.x + (indicator.width * .75), 	lng: indicator.y},
			{lat: indicator.x + (indicator.width * .55), 		lng: indicator.y + (indicator.height / 8)},
			{lat: indicator.x + (indicator.width * .75), 	lng: indicator.y + (indicator.height / 4)},
		];

		this.poly = new google.maps.Polygon({
			paths: this.polyCoords,
			strokeColor: '#000000',
			strokeOpacity: 1.0,
			strokeWeight: 2,
			fillColor: '#FF0000',
			fillOpacity: 1.0
		});
	}

	addListeners() {
		this.poly.addListener('click', function(event) {

	    });
	}

	init(map) {
		this.poly.setMap(map);
	}
}