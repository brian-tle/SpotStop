const ICON_COLOR_RED = 'ff0000';    //BAD
const ICON_COLOR_ORANGE = 'ef9423'; //EH
const ICON_COLOR_GRAY =  '808080'; //NOOTRAL
const ICON_COLOR_GREEN = '78bc71';  //mellou
const ICON_COLOR_DARK_GREEN = '0d9e00'; //WOO

class Marker {
  constructor(map, x, y, totalPoints = 30, existing = false, des = "New Marker") {
    this.lat = x;
    this.lng = y;
    this.default = { lat: parseFloat(x), lng: parseFloat(y) };
    this.positionOffset = { lat: parseFloat(x + 0.0005), lng: parseFloat(y) };

    this.totalPoints = totalPoints;
    this.existing = existing;
    this.des = des;

    this.color;
    this.size = 40;

    this.initializeMarker(map);
  }

  initializeMarker(map) {
    if (!this.existing) { createMarker(x, y, des, 0, 0); }

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

  addListeners(map) {
    this.marker.addListener('click', function(event) {
      map.setZoom(18);
      map.setCenter(this.positionOffset);
      this.indicator.setVisible(true);
    }.bind(this));

    this.indicator.addListeners();

    this.indicator.upvote.poly.addListener(
      "click",
      function(event) {
        var colorOption = { fillColor: "#46db46" };
        var colorOption2 = { fillColor: "#474747" };
        this.indicator.upvote.poly.setOptions(colorOption);
        this.indicator.downvote.poly.setOptions(colorOption2);
        if (this.indicator.status == 0) { this.totalPoints += 2; upvoteMarker(this.lat, this.lng, 1); downvoteMarker(this.lat, this.lng, -1); }
        else { if (this.indicator.status == 1) { this.totalPoints += 1; upvoteMarker(this.lat, this.lng, 1); } }
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
        if (this.indicator.status == 2) { this.totalPoints -= 2; downvoteMarker(this.lat, this.lng, 1); upvoteMarker(this.lat, this.lng, -1); }
        else { if (this.indicator.status == 1) { this.totalPoints -= 1; downvoteMarker(this.lat, this.lng, 1);  } }
        this.refreshIcon();
        this.indicator.status = 0;
        this.indicator.active = true;
      }.bind(this)
    );
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
          scaledSize: { width: this.size, height: this.size }
      };
  }

  get getMarker() {
    return this.getM();
  }

  getM() {
    return this.marker;
  }
}
