// after running the server (node server.js)
// open index.html in the browser
// enter the command getData()

// I'm getting an error (Cross-Origin Request Blocked) but everything else seems to be working
// If I can set the CORS header to (Access-Control-Allow-Origin: *) everthing would be perfectly fine
// But I have no idea what a CORS header is and how to add one...

function getData(){
  $.ajax({
    url : 'http://localhost:8080/hello',
    method : 'GET',
    success : function(data){
      console.log(data);
    },

    error: function(err){
      console.log('Failed');
    }
  });
}