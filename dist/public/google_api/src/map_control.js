var inRangeIndicator = false;
var inRangeLabel = false;
var display_name;
var deleteToggled = false;
var proposeToggled = false;

function CenterControl(controlDiv, map) {
  // Set CSS for the control border.
  var controlUI = document.createElement("div");
  controlUI.setAttribute("id", "propose-button");
  controlUI.style.backgroundColor = "#fff";
  controlUI.style.border = "2px solid #fff";
  controlUI.style.borderRadius = "3px";
  controlUI.style.boxShadow = "0 2px 6px rgba(255,0,0,1)";
  controlUI.style.cursor = "pointer";
  controlUI.style.marginBottom = "0px";
  controlUI.style.marginRight = "5px";
  controlUI.style.textAlign = "center";
  controlUI.title = "Propose Marker?";
  controlDiv.appendChild(controlUI);

  // Set CSS for the control interior.
  var controlText = document.createElement("div");
  controlText.style.color = "rgb(25,25,25)";
  controlText.style.fontFamily = "Roboto,Arial,sans-serif";
  controlText.style.fontSize = "16px";
  controlText.style.lineHeight = "38px";

  controlText.innerHTML = "Propose Marker";
  controlUI.appendChild(controlText);

    // Setup the click event listeners: transform cursor to red (No longer red: just the crosshair)
  controlUI.addEventListener("click", function() {
      // execute the event if the user is logged in
      // call window alert if the user is:
      // 1) not logged in
      // 2) trying to access the function when the cookie is expired
    if (document.cookie != '') {
      switchProposeToggled();
      
    }
    else {
      window.alert("Please sign in or register to add a marker!!!")
    }

  });
}

function DeleteButton(controlDiv, map) {
  // Set CSS for the control border.
  var controlUI = document.createElement("div");
  controlUI.setAttribute("id", "delete-button");
  controlUI.style.backgroundColor = "#fff";
  controlUI.style.border = "2px solid #fff";
  controlUI.style.borderRadius = "3px";
  controlUI.style.boxShadow = "0 2px 6px rgba(255,0,0,1)";
  controlUI.style.cursor = "pointer";
  controlUI.style.marginBottom = "5px";
  controlUI.style.marginRight = "5px";
  controlUI.style.textAlign = "center";
  controlUI.title = "Propose Marker?";
  controlDiv.appendChild(controlUI);

  // Set CSS for the control interior.
  var controlText = document.createElement("div");
  controlText.style.color = "rgb(25,25,25)";
  controlText.style.fontFamily = "Roboto,Arial,sans-serif";
  controlText.style.fontSize = "16px";
  controlText.style.lineHeight = "38px";

  controlText.innerHTML = "Delete Marker";
  controlUI.appendChild(controlText);

  controlUI.addEventListener("click", function() {
    switchDeleteToggled();
  });
}

function addListenerControl(map) {
    map.addListener("click", function(event) {
      // check if user's logged in, just for safety measures
      // execute the event if the user is logged in
      // call window alert if the user is:
      // 1) not logged in
      // 2) trying to access the function when the cookie is expired
      if (document.cookie != '') {
      if (proposeToggled) {
        $.getJSON("https://nominatim.openstreetmap.org/reverse?format=json&lat="+event.latLng.lat()+"&lon="+event.latLng.lng(), function(json){
                 //do some thing with json  or assign global variable to incoming json.
                  display_name=json;
            });
            if (!display_name) {
              markerList.push(new Marker(map, event.latLng.lat(), event.latLng.lng()));
            }
            else {
              markerList.push(new Marker(map, event.latLng.lat(), event.latLng.lng(), display_name["display_name"]));
            }
        markerList[markerList.length - 1].zoomToMarker(map, false);
        setProposeToggled(false);
      }
    }
    else {
      //window.alert("Please sign in or register to add a marker!!!");
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

//generates the user controls specific to the account (user, admin, ect...)
function generateAccountControls(type) {
  if (type == 1) {
    var deleteButtonDiv = document.createElement("div");
    var deleteButton = new DeleteButton(deleteButtonDiv, map);

    deleteButtonDiv.index = 1;
    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(deleteButtonDiv);
  }
}

function setDeleteToggled(value) {
  if (value == false) {
    document.getElementById('delete-button').style.boxShadow = "0 2px 6px rgba(255,0,0,1)";
    deleteToggled = false;
  }
  else {
    document.getElementById('delete-button').style.boxShadow = "0 2px 6px rgba(0,255,0,1)";
    deleteToggled = true;
  }
}

function switchDeleteToggled() {
  if (deleteToggled == false) {
    document.getElementById('delete-button').style.boxShadow = "0 2px 6px rgba(0,255,0,1)";
    deleteToggled = true;
  }
  else {
    document.getElementById('delete-button').style.boxShadow = "0 2px 6px rgba(255,0,0,1)";
    deleteToggled = false;
  }
}

function setProposeToggled(value) {
  if (value == false) {
    document.getElementById('propose-button').style.boxShadow = "0 2px 6px rgba(255,0,0,1)";
    map.setOptions({
      draggableCursor:
        "url(https://maps.gstatic.com/mapfiles/openhand_8_8.cur), default"
    });
    proposeToggled = false;
  }
  else {
    document.getElementById('propose-button').style.boxShadow = "0 2px 6px rgba(0,255,0,1)";
    map.setOptions({
      //draggableCursor: "url(res/icons/6YToyEF.png), auto"
                   draggableCursor: "crosshair"
    });
    proposeToggled = true;
  }
}

function switchProposeToggled() {
  if (proposeToggled == false) {
    document.getElementById('propose-button').style.boxShadow = "0 2px 6px rgba(0,255,0,1)";
    map.setOptions({
      //draggableCursor: "url(res/icons/6YToyEF.png), auto"
                   draggableCursor: "crosshair"
    });
    proposeToggled = true;
  }
  else {
    document.getElementById('propose-button').style.boxShadow = "0 2px 6px rgba(255,0,0,1)";
    map.setOptions({
      draggableCursor:
        "url(https://maps.gstatic.com/mapfiles/openhand_8_8.cur), default"
    });
    proposeToggled = false;
  }
}