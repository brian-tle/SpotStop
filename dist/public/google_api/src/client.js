//  https://sfhacks2019-1551558382883.appspot.com
//  http://localhost:8080

const url = 'http://localhost:8080';

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

//generates the user controls specific to the account (user, admin, ect...)
function generateAccountControls(type) {
  if (type == 1) {
    var deleteButton = document.createElement("BUTTON");
    deleteButton.setAttribute("id", "delete-button");
    deleteButton.innerHTML = "Delete Marker";
    deleteButton.addEventListener("click", () => {

    });
    document.body.appendChild(deleteButton);
  }
}

function createTestMarker(){
  $.ajax({
    url : url + '/createTestMarker',
    method : 'GET',
    success : function(data){
      console.log(data);
    },

    error: function(err){
      console.log('Failed');
    }
  });
}

function getAllMarkers(map){
  $.ajax({
    url : url + '/getAllMarkers',
    method : 'GET',
    success : function(data){
      data.forEach(marker => {
        markerList.push(new Marker(map, marker.lat, marker.lng, marker.display_name, (marker.upvote - marker.downvote) + 20, true, marker.des, marker._id));
      });
    },

    error: function(err){
      console.log('Failed');
    }
  });
}


function getAllUsers(){
  $.ajax({
    url : url + '/getAllUsers',
    method : 'GET',
    success : function(data){
    },

    error: function(err){
      console.log('Failed');
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

function deleteMarker(username, _id) {
  data = { username: username, _id: _id };
  $.ajax({
    type: 'POST',
    url: url + '/deleteMarker',
    async: true,
    data: JSON.stringify(data),
    dataType: 'json',
    contentType: 'application/json; charset=utf-8',
    success: function (data) {
      for (var x = 0; x < markerList.length; x++) {
        if (markerList[x]._id = data) {
          markerList.splice(x, 1);
          x = markerList.length + 1;
        }
      }
    },
    error: function (xhr, ajaxOptions, thrownError) { }
  });
}

function addUser(user, em, pass) {
  data = {username: user, email:em, password: pass};
  $.ajax({
    type: 'POST',
    url: url + '/addUser',
    async: true,
    data: JSON.stringify(data),
    crossDomain: true,
    contentType: 'application/json; charset=utf-8',
    success: function (data) { 
      window.alert ("You have create your account!");
      window.location = "http://onespotstop.com"; },
    error: function (xhr, ajaxOptions, thrownError) { 
      window.alert("username and/or email is already taken!");
    }
  });
}

function upvoteUser(markerId, name, value, indicator, totalPoints) {
  data = {marker_id: markerId, username: name, rating: value};
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
    error: function(xhr, ajaxOptions, thrownError) {
      window.alert("You have already upvoted this marker!");
    }
  });
}

function downvoteUser(markerId, name, value, indicator, totalPoints) {
  data = {marker_id: markerId, username: name, rating: value};
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
    error: function(xhr, ajaxOptions, thrownError) {
      window.alert("You have already downvoted this marker!");
    }
  });
}

// login features in client.js
// first, it will send username and password to the
// serverside. Once it succeeds, this function will
// create a cookie.
// Otherwise, it won't do anything.
function logIn(name, pass) {
  data = {username: name, password: pass};
  $.ajax({
    type: 'POST',
    url: url + '/login',
    async: true,
    data: JSON.stringify(data),
    crossDomain: true,
    contentType: 'application/json; charset=utf-8',
    success: function (data) {
      window.alert('You have successfully signed in, ' + name + '!');
      validate = true;
      var now = new Date();
      var time = now.getTime();
      var expireTime = time + (1800 * 1000);
      now.setTime(expireTime);
      document.cookie = "username=" + name + "; expires=" + now.toUTCString()+';path=/';
      window.location = 'http://onespotstop.com';
    },
    error: function(xhr, ajaxOptions, thrownError) {
      window.alert("Username and/or password is incorrect!");
    }
  });
}
