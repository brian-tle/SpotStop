function createTestMarker(){
  $.ajax({
    url : 'http://localhost:8080/createTestMarker',
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
    url : 'http://localhost:8080/getAllMarkers',
    method : 'GET',
    success : function(data){
      data.forEach(marker => {
        markerList.push(new Marker(marker.lat, marker.lng, (marker.upvote - marker.downvote) + 30, true));
        markerList[markerList.length - 1].createMarker(map);
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
    url: "http://localhost:8080/createMarker",
    async: true,
    data: JSON.stringify(data),
    dataType: 'json',
    contentType: 'application/json; charset=utf-8',
    success: function (data) {  process_cache_changes(data);  },
    error: function (xhr, ajaxOptions, thrownError) { }
  });
}