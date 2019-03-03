class MarkerIndicator {
	constructor(marker) {
		this.active = false;

		this.x = marker.lat - (0.001 / 2);
		this.y = marker.lng - (0.001 / 2);
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
			strokeColor: '#000000',
			strokeOpacity: 1.0,
			strokeWeight: 2,
			fillColor: '#b5becc',
			fillOpacity: 0.90
		});

		this.upvote = new UpvoteTriangle(this);
		this.downvote = new DownvoteTriangle(this);
	}

	addListeners() {
		this.upvote.poly.addListener('click', function(event) {
			var colorOption = { fillColor: '#46db46' };
			var colorOption2 = { fillColor: '#474747' };
			this.upvote.poly.setOptions(colorOption);
			this.downvote.poly.setOptions(colorOption2);
			this.active = true;
	    }.bind(this));

	    this.downvote.poly.addListener('click', function(event) {
			var colorOption = { fillColor: '#FF0000' };
			var colorOption2 = { fillColor: '#474747' };
			this.downvote.poly.setOptions(colorOption);
			this.upvote.poly.setOptions(colorOption2);
			this.active = true;
	    }.bind(this));
	}
	
	init(map) {
		this.poly.setMap(map);
		this.upvote.init(map);
		this.downvote.init(map);
	}
}

class UpvoteTriangle {
	constructor(indicator) { 
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
			fillColor: this.notVotedColor,
			fillOpacity: 1.0
		});
	}

	init(map) {
		this.poly.setMap(map);
	}
}

class DownvoteTriangle {
	constructor(indicator) { 
		this.notVotedColor = '#474747';
		this.votedColor = '#FF0000';

		this.polyCoords = [
			{lat: indicator.x + (indicator.width * .75), 	lng: indicator.y},
			{lat: indicator.x + (indicator.width * .55), 	lng: indicator.y + (indicator.height / 8)},
			{lat: indicator.x + (indicator.width * .75), 	lng: indicator.y + (indicator.height / 4)},
		];

		this.poly = new google.maps.Polygon({
			paths: this.polyCoords,
			strokeColor: '#000000',
			strokeOpacity: 1.0,
			strokeWeight: 2,
			fillColor: this.notVotedColor,
			fillOpacity: 1.0
		});
	}

	init(map) {
		this.poly.setMap(map);
	}
}