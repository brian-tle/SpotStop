var cursorRunning = false;
var inRangeIndicator = false;
var inRangeLabel = false;

function CenterControl(controlDiv, map) {
  // Set CSS for the control border.
  var controlUI = document.createElement("div");
  controlUI.style.backgroundColor = "#fff";
  controlUI.style.border = "2px solid #fff";
  controlUI.style.borderRadius = "3px";
  controlUI.style.boxShadow = "0 2px 6px rgba(0,0,0,.3)";
  controlUI.style.cursor = "pointer";
  controlUI.style.marginBottom = "0px";
  controlUI.style.textAlign = "center";
  controlUI.title = "Propose Marker?";
  controlDiv.appendChild(controlUI);

  // Set CSS for the control interior.
  var controlText = document.createElement("div");
  controlText.style.color = "rgb(25,25,25)";
  controlText.style.fontFamily = "Roboto,Arial,sans-serif";
  controlText.style.fontSize = "16px";
  controlText.style.lineHeight = "38px";

  controlText.style.marginLeft = "5px";

  controlText.innerHTML = "Propose Marker";
  controlUI.appendChild(controlText);

  // Setup the click event listeners: transform cursor to red
  controlUI.addEventListener("click", function() {
    cursorRunning = true;
    map.setOptions({
      //draggableCursor: "url(res/icons/6YToyEF.png), auto"
                   draggableCursor: "crosshair"
    });
  });
}

function addListenerControl(map) {
  map.addListener("click", function(event) {
    if (cursorRunning) {
      markerList.push(new Marker(map, event.latLng.lat(), event.latLng.lng()));
      markerList[markerList.length - 1].zoomToMarker(map, false);
      map.setOptions({
        draggableCursor:
          "url(https://maps.gstatic.com/mapfiles/openhand_8_8.cur), default"
      });
      cursorRunning = false;
    }
  });

  //This may seem unnecessary but it prevents refreshing all entities every zoom 
  map.addListener("zoom_changed", function(event) {
      if (map.getZoom() != MARKER_INDICATOR_RANGE && inRangeIndicator) {
        markerList.forEach(marker => { 
          inRangeIndicator = false;
          marker.indicator.setVisible(inRangeIndicator); 
        })
      }
      else {
        if (map.getZoom() == MARKER_INDICATOR_RANGE && !inRangeIndicator) {
          markerList.forEach(marker => { 
            inRangeIndicator = true;
          })
        }
      }

      if (map.getZoom() < MARKER_LABEL_RANGE && inRangeLabel) {
        markerList.forEach(marker => { 
          inRangeLabel = false;
          marker.popup.setInRange(inRangeLabel);
          marker.scale = ICON_SCALE_MIN;
          marker.refreshIcon();
        })
      }
      else {
        if (map.getZoom() >= MARKER_LABEL_RANGE && !inRangeLabel) {
          markerList.forEach(marker => { 
            inRangeLabel = true;
            if (marker.popupCreated) {
              marker.popup.setInRange(inRangeLabel);
            }
            marker.scale = ICON_SCALE_MAX;
            marker.refreshIcon();
          })
        }
      }
  });
}

function addControls(map) {
  var centerControlDiv = document.createElement("div");
  var centerControl = new CenterControl(centerControlDiv, map);

  centerControlDiv.index = 1;
  map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(centerControlDiv);
}
