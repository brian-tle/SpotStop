//  https://sfhacks2019-1551558382883.appspot.com
//  localhost:8080

const url = 'https://sfhacks2019-1551558382883.appspot.com';

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
        markerList.push(new Marker(map, marker.lat, marker.lng, (marker.upvote - marker.downvote) + 30, true, marker.des, marker._id));
      });
    },

    error: function(err){
      console.log('Failed');
    }
  });
}

function createMarker(lat, lng, des, upvote, downvote) {
  data = { lat: lat, lng: lng, des: des, upvote: upvote, downvote: downvote };
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