const ICON_COLOR_RED =        'ff0000';  //BAD
const ICON_COLOR_ORANGE =     'ef9423';  //EH
const ICON_COLOR_GRAY =       '808080';  //NOOTRAL
const ICON_COLOR_GREEN =      '78bc71';  //mellou
const ICON_COLOR_DARK_GREEN = '0d9e00';  //WOO

const ICON_SCALE_MAX = 1.00;
const ICON_SCALE_MIN = 0.43;

const MARKER_INDICATOR_RANGE = 18;
const MARKER_LABEL_RANGE = 15;

var infowindow;
var formStr = "<input type='text' id='marker-label' value='New Marker' /><input type='button' value='submit' onclick='addLabel();' />"

function addLabel() {
  markerList[markerList.length - 1].des = document.getElementById('marker-label').value;
  markerList[markerList.length - 1].createLabel(Marker.map);
  markerList[markerList.length - 1].popupCreated = true;
  markerList[markerList.length - 1].popup.inRange = true;
  createMarker(markerList[markerList.length - 1].lat, markerList[markerList.length - 1].lng, markerList[markerList.length - 1].des, 0, 0);
  markerList[markerList.length - 1].indicator.setVisible(true);
  infowindow.close();
}

function removeLastMarker() {
  markerList[markerList.length - 1].marker.setMap(null);
  markerList.pop();
}

class Marker {
  constructor(map, x, y, totalPoints = 30, existing = false, des = "New Marker", _id = 'undefined') {
    this.lat = x;
    this.lng = y;
    this.default = { lat: parseFloat(x), lng: parseFloat(y) };
    this.positionOffset = { lat: parseFloat(x + 0.0005), lng: parseFloat(y) };
    this.infoWindowOffset = { lat: parseFloat(x + 0.0002), lng: parseFloat(y) };

    this.totalPoints = totalPoints;
    this.existing = existing;
    this.popupCreated = existing;
    this.des = des;
    this._id = _id;

    this.color;
    this.size = 40;
    this.scale = ICON_SCALE_MIN;

    this.initializeMarker(map);
  }

  initializeMarker(map) {
    Popup = createPopupClass();

    if (!this.existing) { 
      this.scale = ICON_SCALE_MAX;
      infowindow = new google.maps.InfoWindow({ 
        content: formStr,
        position: this.infoWindowOffset
      });
      infowindow.addListener('closeclick', function(event) {
        removeLastMarker();
      });
      infowindow.open(map);
    }
    else {
      this.createLabel(map);
    }

    this.setIcon();

    this.marker = new google.maps.Marker({
      position: this.default,
      animation: google.maps.Animation.DROP,
      map: map,
      icon: this.icon,
      zIndex: this.totalPoints
    });

    this.indicator = new MarkerIndicator(map, this);
    this.addListeners(map);
  }

  createLabel(map) {
    this.label = document.createElement('div');
    this.label.innerHTML = this.des;
    this.label.setAttribute('id', 'testcontent')

    this.popup = new Popup(new google.maps.LatLng(this.lat , this.lng), this.label);
    this.popup.setMap(map);
  }

  addListeners(map) {
    this.marker.addListener('click', function(event) {
      this.zoomToMarker(map);
    }.bind(this));

    this.indicator.addListeners();

    this.indicator.upvote.poly.addListener(
      "click",
      function(event) {
        var colorOption = { fillColor: "#46db46" };
        var colorOption2 = { fillColor: "#474747" };
        this.indicator.upvote.poly.setOptions(colorOption);
        this.indicator.downvote.poly.setOptions(colorOption2);
        if (this.indicator.status == 0) { this.totalPoints += 2; upvoteMarker(this._id, 1); downvoteMarker(this._id, -1); }
        else { if (this.indicator.status == 1) { this.totalPoints += 1; upvoteMarker(this._id, 1); } }
        this.refreshIcon();
        this.indicator.status = 2;
        this.indicator.active = true;
      }.bind(this)
    );

    this.indicator.downvote.poly.addListener(
      "click",
      function(event) {
        var colorOption = { fillColor: "#FF0000" };
        var colorOption2 = { fillColor: "#474747" };
        this.indicator.downvote.poly.setOptions(colorOption);
        this.indicator.upvote.poly.setOptions(colorOption2);
        if (this.indicator.status == 2) { this.totalPoints -= 2; downvoteMarker(this._id, 1); upvoteMarker(this._id, -1); }
        else { if (this.indicator.status == 1) { this.totalPoints -= 1; downvoteMarker(this._id, 1);  } }
        this.refreshIcon();
        this.indicator.status = 0;
        this.indicator.active = true;
      }.bind(this)
    );
  }

  zoomToMarker(map, showIndicator = true) {
    map.setZoom(18);
    map.setCenter(this.positionOffset);
    this.indicator.setVisible(showIndicator);
  }

  refreshIcon() {
      this.setIcon();   
      this.marker.setZIndex(this.totalPoints);
      this.marker.setIcon(this.icon);
  }

  setIcon() {
    if ( this.totalPoints > 45) {
          this.color = ICON_COLOR_DARK_GREEN;
          this.size = 60;
      } else if (this.totalPoints <= 45 && this.totalPoints > 37) {
          this.color = ICON_COLOR_GREEN;
          this.size = 50;
      } else if (this.totalPoints <= 37 && this.totalPoints > 23) {
          this.color = ICON_COLOR_GRAY;
          this.size = 40;
      } else if (this.totalPoints <= 23 && this.totalPoints > 15) {
          this.color = ICON_COLOR_ORANGE;
          this.size = 30;
      } else if (this.totalPoints < 15) {
          this.color = ICON_COLOR_RED;
          this.size = 20;
      }

      this.icon = {
          url: 'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2238%22%20height%3D%2238%22%20viewBox%3D%220%200%2038%2038%22%3E%3Cpath%20fill%3D%22%23' + this.color + '%22%20stroke%3D%22%23ccc%22%20stroke-width%3D%22.5%22%20d%3D%22M34.305%2016.234c0%208.83-15.148%2019.158-15.148%2019.158S3.507%2025.065%203.507%2016.1c0-8.505%206.894-14.304%2015.4-14.304%208.504%200%2015.398%205.933%2015.398%2014.438z%22%2F%3E%3Ctext%20transform%3D%22translate%2819%2018.5%29%22%20fill%3D%22%23fff%22%20style%3D%22font-family%3A%20Arial%2C%20sans-serif%3Bfont-weight%3Abold%3Btext-align%3Acenter%3B%22%20font-size%3D%2212%22%20text-anchor%3D%22middle%22%3E' + this.totalPoints + '%3C%2Ftext%3E%3C%2Fsvg%3E',
          scaledSize: { width: this.size * this.scale, height: this.size * this.scale }
      };
  }

  get getMarker() {
    return this.getM();
  }

  getM() {
    return this.marker;
  }
}
