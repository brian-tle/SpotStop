class Marker {
  constructor(x, y) {
    this.lat = x;
    this.lng = y;
    this.default = { lat: parseFloat(x), lng: parseFloat(y) };
    this.marker;

    this.positionOffset = { lat: parseFloat(x + 0.0008), lng: parseFloat(y) };
  }
  //createmarker(x,y) {

  // The map, centered at Uluru
  //  var map = new google.maps.Map(document.getElementById('map'), {zoom: 12, center: this.m});
  //  map.setOptions(mapOptions);
  // The marker, positioned at Uluru
  //  var marker = new google.maps.Marker({position: this.m, map: map,animation:google.maps.Animation.DROP});

  //}
  get m() {
    return this.mm();
  }

  mm() {
    return this.default;
  }

  createMarker(map) {
    this.map = map;
    this.marker = new google.maps.Marker({
      position: this.default,
      animation: google.maps.Animation.DROP,
      map: map
    });

    this.marker.addListener('click', function(event) {
      this.map.setZoom(18);
      this.map.setCenter(this.positionOffset);
      this.indicator.setVisible(true);
    }.bind(this));

    this.indicator = new MarkerIndicator(this);
    this.indicator.init(map);
    this.indicator.addListeners();
  }

  get GetMarker() {
    return this.GetM();
  }

  GetM() {
    return this.marker;
  }
}
