const url = 'https://sfhacks2019-1551558382883.appspot.com';

function getTopMarkers(){
  $.ajax({
    url : url + '/getTopMarkers',
    method : 'GET',
    success : function(data){
      console.log(data);
      data.forEach(marker => {

      });
    },

    error: function(err){
      console.log('Failed');
    }
  });
}