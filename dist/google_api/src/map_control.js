var cursorRunning = false;

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
      markerList.push(new Marker(event.latLng.lat(), event.latLng.lng()));
      markerList[markerList.length - 1].createMarker(map);
      map.setOptions({
        draggableCursor:
          "url(https://maps.gstatic.com/mapfiles/openhand_8_8.cur), default"
      });
      cursorRunning = false;
    }
  });
}

function addControls(map) {
  var centerControlDiv = document.createElement("div");
  var centerControl = new CenterControl(centerControlDiv, map);

  centerControlDiv.index = 1;
  map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(centerControlDiv);
}
