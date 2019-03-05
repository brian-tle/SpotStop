function createTestMarker(){
  $.ajax({
    url : 'http://localhost:8080/create_test_marker',
    method : 'GET',
    success : function(data){
      console.log(data);
    },

    error: function(err){
      console.log('Failed');
    }
  });
}