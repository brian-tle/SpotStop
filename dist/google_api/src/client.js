 function getData(){
  $.ajax({
    url : 'localhost:3000',
    method : 'GET',
    success : function(data){
      console.log(data);
    },

    error: function(err){
      console.log('Failed');
    }
  });
} 