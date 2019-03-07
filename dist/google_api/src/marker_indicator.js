class MarkerIndicator {
  constructor(map, marker) {
    // 0 - Bad
    // 1 - Neutral
    // 2 - Good
    this.status = 1;
    this.active = false;

    this.x = marker.positionOffset.lat - 0.0005 / 2;
    this.y = marker.positionOffset.lng - 0.0005 / 2;
    this.width = 0.0005;
    this.height = 0.0005;

    this.polyCoords = [
      { lat: this.x, lng: this.y },
      { lat: this.x + this.width, lng: this.y },
      { lat: this.x + this.width, lng: this.y + this.height },
      { lat: this.x, lng: this.y + this.height }
    ];

    this.poly = new google.maps.Polygon({
      map: map,
      paths: this.polyCoords,
      strokeColor: "#000000",
      strokeOpacity: 1.0,
      strokeWeight: 2,
      fillColor: "#b5becc",
      fillOpacity: 0.9
    });

    this.triangleCoords = [
      { lat: this.x,                      lng: this.y + (this.height * 0.40)},
      { lat: this.x - this.width * 0.1,   lng: this.y + this.height / 2 },
      { lat: this.x,                      lng: this.y + (this.height * 0.60) }
    ];

    this.triangle = new google.maps.Polygon({
      map: map,
      paths: this.triangleCoords,
      strokeColor: "#000000",
      strokeOpacity: 1.0,
      strokeWeight: 2,
      fillColor: "#b5becc",
      fillOpacity: 0.9
    });

    this.exitCoords = [
      { lat: this.x + (this.width * .98), lng: this.y + (this.height * .88) },
      { lat: this.x + (this.width * .98), lng: this.y + (this.height * .98) },
      { lat: this.x + (this.width * .90), lng: this.y + (this.height * .98) },
      { lat: this.x + (this.width * .90), lng: this.y + (this.height * .88) }
    ];

    this.exit = new google.maps.Polygon({
      map: map,
      paths: this.exitCoords,
      strokeColor: "#ff0000",
      strokeOpacity: 1.0,
      strokeWeight: 2,
      fillColor: "#ffbecc",
      fillOpacity: 0.95
    });

    this.upvote = new UpvoteTriangle(map, this);
    this.downvote = new DownvoteTriangle(map, this);

    this.poly.setVisible(false);
    this.triangle.setVisible(false);
    this.exit.setVisible(false);
    this.upvote.poly.setVisible(false);
    this.downvote.poly.setVisible(false);
  }

  setVisible(visible) {
    this.poly.setVisible(visible);
    this.triangle.setVisible(visible);
    this.exit.setVisible(visible);
    this.upvote.poly.setVisible(visible);
    this.downvote.poly.setVisible(visible);
  }

  addListeners() {
    this.exit.addListener(
      "click",
      function(event) {
        this.setVisible(false);
      }.bind(this)
    );
  }
}

class UpvoteTriangle {
  constructor(map, indicator) {
    this.notVotedColor = "#474747";
    this.votedColor = "#46db46";

    this.polyCoords = [
      { lat: indicator.x + indicator.width * 0.55, lng: indicator.y + indicator.height * 0.1 },
      { lat: indicator.x + indicator.width * 0.95, lng: indicator.y + indicator.height * 0.5 },
      { lat: indicator.x + indicator.width * 0.55, lng: indicator.y + indicator.height * 0.9 }
    ];

    this.poly = new google.maps.Polygon({
      map: map,
      paths: this.polyCoords,
      strokeColor: "#000000",
      strokeOpacity: 1.0,
      strokeWeight: 2,
      fillColor: this.notVotedColor,
      fillOpacity: 1.0
    });
  }
}

class DownvoteTriangle {
  constructor(map, indicator) {
    this.notVotedColor = "#474747";
    this.votedColor = "#FF0000";

    this.polyCoords = [
      { lat: indicator.x + indicator.width * 0.45, lng: indicator.y + indicator.height * 0.1 },
      { lat: indicator.x + indicator.width * 0.05, lng: indicator.y + indicator.height * 0.5 },
      { lat: indicator.x + indicator.width * 0.45, lng: indicator.y + indicator.height * 0.9 }
    ];

    this.poly = new google.maps.Polygon({
      map: map,
      paths: this.polyCoords,
      strokeColor: "#000000",
      strokeOpacity: 1.0,
      strokeWeight: 2,
      fillColor: this.notVotedColor,
      fillOpacity: 1.0
    });
  }
}
