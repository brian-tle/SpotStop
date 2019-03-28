//  https://sfhacks2019-1551558382883.appspot.com
//  http://localhost:8080

const url = 'http://localhost:8080';

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

function createMarker(lat, lng, name, des, upvote, downvote) {
  data = { lat: lat, lng: lng, name: name, des: des, upvote: upvote, downvote: downvote };
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

function upvoteMarker(_id, val) {
  data = { _id: _id, val: val };
  $.ajax({
    type: 'POST',
    url: url + '/upvoteMarker',
    async: true,
    data: JSON.stringify(data),
    dataType: 'json',
    contentType: 'application/json; charset=utf-8',
    success: function (data) {  process_cache_changes(data);  },
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
    dataType: 'json',
    contentType: 'application/json; charset=utf-8',
    success: function (data) { console.log('added user'); },
    error: function (xhr, ajaxOptions, thrownError) { }
  });
}

function downvoteMarker(_id, val) {
  data = { _id: _id, val: val };
  $.ajax({
    type: 'POST',
    url: url + '/downvoteMarker',
    async: true,
    data: JSON.stringify(data),
    dataType: 'json',
    contentType: 'application/json; charset=utf-8',
    success: function (data) {  process_cache_changes(data);  },
    error: function (xhr, ajaxOptions, thrownError) { }
  });
}

function addUserVotes(userRating, name) {
  data = {rating: userRating, username: name};
  $.ajax({
    type: 'POST',
    url: url + '/addUserVotes',
    async: true,
    data: JSON.stringify(data),
    contentType: 'application/json; charset=utf-8',
    success: function (data) {console.log('changing user votes');},
    error: function(xhr, ajaxOptions, thrownError) {}
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