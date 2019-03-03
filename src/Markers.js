class MasterMarker {
    constructor(x, y, map) {
        this.marker = new google.maps.Marker({position: {lat: this.x, lng: this.y}, map: map});
    }
}
