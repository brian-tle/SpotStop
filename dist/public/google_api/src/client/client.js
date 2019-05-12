//  https://sfhacks2019-1551558382883.appspot.com
//  http://localhost:8080
const url = 'https://sfhacks2019-1551558382883.appspot.com';
// const url = 'http://localhost:8080';

function getAllMarkers(map) {
  $.ajax({
      url: url + '/getAllMarkers',
      method: 'GET',
      success: function (data) {
      data.forEach(marker => {
          markerList.push(new Marker(map, marker.lat, marker.lng, marker.display_name, (marker.upvote - marker.downvote) + 20, true, marker.des, marker._id));
      });
      },

      error: function (err) { console.log('Failed'); }
  });
}

function upvoteUser(markerId, name, value, indicator, totalPoints) {
  data = { marker_id: markerId, username: name, rating: value };
  $.ajax({
    type: 'POST',
    url: url + '/upvoteUser',
    async: true,
    data: JSON.stringify(data),
    contentType: 'application/json; charset=utf-8',
    success: function (data) {
      /**  tot stores the totalPoint of the given marker
           line 123-124 sets the upvote.poly and downvote.poly to
           the given color
       **/
      var tot = totalPoints;
      var colorOption = { fillColor: "#46db46" };
      var colorOption2 = { fillColor: "#474747" };
      indicator.upvote.poly.setOptions(colorOption);
      indicator.downvote.poly.setOptions(colorOption2);
      if (indicator.status == 0) { tot += 2; }
      else { if (indicator.status == 1) { tot += 1; } }
      /**
       * Iterate through markerList and if the marker matches the given id,
       * update the marker's total point by assigning value of tot to it.
       * After that, refresh that marker
       */
      markerList.forEach(marker => {
        if (marker._id == markerId) {
          marker.totalPoints = tot;
          marker.refreshIcon();
        }
      });
      indicator.status = 2;
      indicator.active = true;
    },
    error: function (xhr, ajaxOptions, thrownError) {
      window.alert("You have already upvoted this marker!");
    }
  });
}

function validateEditing(id, user_cookie) {
  data = { marker_id: id, cookie: user_cookie };
  $.ajax({
    type: 'POST',
    url: url + '/validateEditing',
    async: true,
    data: JSON.stringify(data),
    crossDomain: true,
    contentType: 'application/json; charset=utf-8',
    success: function (data) {
      markerList.forEach(marker => {
        if (marker._id == id) {
          marker.label.isContentEditable = true;
          marker.zoomToMarker(map, true);
          var input = document.createElement("input");
          input.style.color = 'white';
          input.className = 'popup-bubble';
          input.setAttribute('type', 'text');
          var p = marker.label.parentElement;
          p.appendChild(input);
          var inp = marker.label.parentElement.childNodes[0];
          var inner_inp = inp.innerHTML;
          inp.style.display = 'none';
          var anchor = document.getElementsByClassName('popup-bubble-anchor');
          var inp2 = marker.label.parentElement.childNodes[1];
          inp2.value = inner_inp;
          inp2.style.maxHeight = '27px';
          inp2.style.top = '-4px';

          inp2.addEventListener('keypress', function (event) {
            var key = event.which || event.keyCode;
            if (key == 13) {
              var new_inp_value = inp2.value;
              var des = String(new_inp_value);
              var des_token = des.split(/[,?\s+/.]/);
              for (var i = 0; i < des_token.length; i++) {
                if (prof_list.includes(des_token[i].toLowerCase())) {
                  des_token[i] = '*'.repeat(des_token[i].length);
                }
              }
              var real_des = des_token.join(" ");
              updateDes(id, real_des, user_cookie);
              marker.label.innerHTML = real_des;
            }
          });
        }
      });
    },
    error: function (xhr, ajaxOptions, thrownError) {
    }
  });
}

function updateDes(id, des, user_cookie) {
  data = { marker_id: id, des: des, cookie: user_cookie };
  $.ajax({
    type: 'POST',
    url: url + '/modifyDescription',
    async: true,
    data: JSON.stringify(data),
    crossDomain: true,
    contentType: 'application/json; charset=utf-8',
    success: function (data) {
      markerList.forEach(marker => {
        if (marker._id == id) {
          marker.label.isContentEditable = true;
          marker.zoomToMarker(map, true);
          var p = marker.label.parentElement;
          p.removeChild(p.childNodes[1]);
          var inp = marker.label.parentElement.childNodes[0];
          inp.style.display = 'block';
          $(marker.label).one('click', function (e) {
            validateEditing(this._id, getCookie());
          }.bind(marker));
        }
      });
    },
    error: function (xhr, ajaxOptions, thrownError) {
      window.alert("failed to modify description!");
    }

  });

}

function downvoteUser(markerId, name, value, indicator, totalPoints) {
  data = { marker_id: markerId, username: name, rating: value };
  $.ajax({
    type: 'POST',
    url: url + '/downvoteUser',
    async: true,
    data: JSON.stringify(data),
    contentType: 'application/json; charset=utf-8',
    success: function (data) {
      /**
       * tot represents the marker's current total points
       * line 163-164 sets downvote.poly and upvote.poly
       * to the given color.
       * 
       */
      var tot = totalPoints;
      var colorOption = { fillColor: "#FF0000" };
      var colorOption2 = { fillColor: "#474747" };
      indicator.downvote.poly.setOptions(colorOption);
      indicator.upvote.poly.setOptions(colorOption2);
      if (indicator.status == 2) { tot -= 2; }
      else { if (indicator.status == 1) { tot -= 1; } }
      /**
       * Iterate through the markerList and
       * if the given marker matches the id,
       * then total point of the marker will be updated
       * by reassigning it to tot.
       * After that, refresh that marker
       *  
       */
      markerList.forEach(marker => {
        if (marker._id == markerId) {
          marker.totalPoints = tot;
          marker.refreshIcon();
        }
      });
      indicator.status = 0;
      indicator.active = true;
    },
    error: function (xhr, ajaxOptions, thrownError) {
      window.alert("You have already downvoted this marker!");
    }
  });
}
function createMarker(username, lat, lng, name, des, upvote, downvote) {
  data = { username: username, lat: lat, lng: lng, name: name, des: des, upvote: upvote, downvote: downvote };
  $.ajax({
      type: 'POST',
      url: url + '/createMarker',
      async: true,
      data: JSON.stringify(data),
      dataType: 'json',
      contentType: 'application/json; charset=utf-8',
      success: function (data) {
      markerList[markerList.length - 1]._id = data;
      },
      error: function (xhr, ajaxOptions, thrownError) { }
  });
}

function deleteMarker(cookie, id) {
  data = { cookie: cookie, marker_id: id };
  $.ajax({
      type: 'POST',
      url: url + '/deleteMarker',
      async: true,
      data: JSON.stringify(data),
      crossDomain: true,
      contentType: 'application/json; charset=utf-8',
      success: function (data) {
      for (var x = 0; x < markerList.length; x++) {
          if (markerList[x]._id == data) {
          markerList[x].prepRemove();
          markerList.splice(x, 1);
          x = markerList.length;
          }
      }
      },
      error: function (xhr, ajaxOptions, thrownError) {
      console.log(xhr);
      console.log(ajaxOptions);
      console.log(thrownError);
      console.log(id);
      console.log("Not happening!");
    }
  });
}


function getTop3Markers() {
  $.ajax({
    type: 'GET',
    url: url + '/topThreeMarkers',
    async: true,
    success: function (data) {
      for (var i = 1; i <= data.length; i++) {
        console.log(data[i - 1].name)
        document.getElementById('number' + i).innerHTML = '<img " src="' + data[i - 1].photo + '" id = "img' + i +'" style="width:400px; height:300px; border: 1px solid"/>' 
        + '<div class="text">' + data[i-1].name + '</div>';
      }
    },
    error: function (xhr, ajaxOptions, thrownError) {
      window.alert(thrownError);
    }
  });
}

function createTestMarker() {
  $.ajax({
      url: url + '/createTestMarker',
      method: 'GET',
      success: function (data) { console.log(data); },
      error: function (err) { console.log('Failed'); }
  });
}


function handleAccountType() {
  //run if user is logged in
      if (document.cookie) {
          data = { username: getCookie() };
          $.ajax({
              type: 'POST',
              url: url + '/getAccountType',
              async: true,
              data: JSON.stringify(data),
              dataType: 'json',
              contentType: 'application/json; charset=utf-8',
              success: function (data) {
                  generateAccountControls(data.type);
              },
              error: function (xhr, ajaxOptions, thrownError) { }
          });
      }
  }
  
  function addUser(user, em, pass) {
      data = { username: user, email: em, password: pass };
      $.ajax({
          type: 'POST',
          url: url + '/addUser',
          async: true,
          data: JSON.stringify(data),
          crossDomain: true,
          contentType: 'application/json; charset=utf-8',
          success: function (data) {
              window.alert("You have create your account!");
              window.location = "http://onespotstop.com";
          },
          error: function (xhr, ajaxOptions, thrownError) {
              window.alert("username and/or email is already taken!");
          }
      });
  }
  
  function getAllUsers() {
      $.ajax({
          url: url + '/getAllUsers',
          method: 'GET',
          success: function (data) { },
          error: function (err) { console.log('Failed'); }
      });
  }
  
  // login features in client.js
  // first, it will send username and password to the
  // serverside. Once it succeeds, this function will
  // create a cookie.
  // Otherwise, it won't do anything.
  function logIn(name, pass) {
      data = { username: name, password: pass };
      $.ajax({
          type: 'POST',
          url: url + '/login',
          async: true,
          data: JSON.stringify(data),
          crossDomain: true,
          contentType: 'application/json; charset=utf-8',
          success: function (data) {
              window.alert('You have successfully signed in, ' + name + '!');
              document.cookie = "username=" + data + ";expires=18000000;path=/";
              window.location = 'http://onespotstop.com';
          },
          error: function (xhr, ajaxOptions, thrownError) {
              window.alert("Username and/or password is incorrect!");
          }
      });
    }  

function getStartingMarker(img_src) {
  data = {img_src: img_src};
  $.ajax({
    type: 'POST',
    url: url + '/getStartingMarker',
    async: true,
    data: JSON.stringify(data),
    crossDomain: true,
    contentType: 'application/json; charset=utf-8',
    success: function (data) {
      map = new google.maps.Map(document.getElementById("map"), {
        zoom: 18,
        // center == where it stores the default latitude
        // and longitude
        center: { lat: parseFloat(data.lat), lng: parseFloat(data.lng) },
        controls: google.maps,
        mapTypeControlOptions: {
          // nothing is inside mapTypeId
          // because we don't want extra features
          // in our map, ex: Sattelite feature
          mapTypeIds: [
          ]
        }
      });
      map.setOptions(mapOptions);
      Marker.map = map;
      addControls(map);
      addListeners(map);
      // retrieve all of the markers in the database
      // and display them on the map
      getAllMarkers(map);
      // call initAutocomplete() to have the search bar
      // working
      initAutocomplete();
      //create account specific controls
      handleAccountType();
      //getTop3Markers();
      sessionStorage.clear();
    },
    error: function (xhr, ajaxOptions, thrownError) {
      console.log(thrownError);
    }
  })
}

function IpStack() {
  $.ajax({
    type: 'GET',
    url: url + '/getIp',
    async: true,
    crossDomain: true,
    success: function (data) {
      lt = parseFloat(data.latitude);
      lg = parseFloat(data.longitude);
      // assign default latitude and longitude
      // to the map
      map = new google.maps.Map(document.getElementById("map"), {
        zoom: 12,
        // center == where it stores the default latitude
        // and longitude
        center: { lat: parseFloat(lt), lng: parseFloat(lg) },
        controls: google.maps,
        mapTypeControlOptions: {
          // nothing is inside mapTypeId
          // because we don't want extra features
          // in our map, ex: Sattelite feature
          mapTypeIds: [
          ]
        }
      });
      map.setOptions(mapOptions);
      Marker.map = map;
      addControls(map);
      addListeners(map);
      // retrieve all of the markers in the database
      // and display them on the map
      getAllMarkers(map);
      // call initAutocomplete() to have the search bar
      // working
      initAutocomplete();
      //create account specific controls
      handleAccountType();
      //getTop3Markers();
    },
    error: function (xhr, ajaxOptions, thrownError) {

    }
  });
}

