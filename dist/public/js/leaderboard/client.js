const url = 'https://sfhacks2019-1551558382883.appspot.com';

function getTopMarkers(){
  $.ajax({
    url : url + '/getTopMarkers',
    method : 'GET',
    success : function(data){
      data.forEach(marker => {
        topMarkersList.push(marker);
      });
    },

    error: function(err){
      console.log('Failed');
    }
  });
}

function getControversialMarkers() {
  $.ajax({
    url : url + '/getControversialMarkers',
    method : 'GET',
    success : function(data){
      data.forEach(marker => {
        controversialMarkersList.push(marker);
      });
    },

    error: function(err){
      console.log('Failed');
    }
  });
}