const url = 'https://sfhacks2019-1551558382883.appspot.com';

function getTopMarkers(){
  $.ajax({
    url : url + '/getTopMarkers',
    method : 'GET',
    success : function(data){
      data.forEach(marker => {
        bufferTM.push(marker);
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
        bufferCM.push(marker);
      });
    },

    error: function(err){
      console.log('Failed');
    }
  });
}

/*

function getTopMarkers(res) {
  MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    var dbo = db.db("spot_stop");
    var sortingOrder = { upvote: -1, downvote: 1 };
    dbo.collection("markers").find().sort(sortingOrder).limit(15).toArray(function(err, result) {
      if (err) throw err;
      res.send(result);
      console.log("Sending Top Markers to Client");
      db.close();
    });
  }); 
}

function getControversialMarkers(res) {
  MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    var dbo = db.db("spot_stop");
    var sortingOrder = { upvote: -1, downvote: -1 };
    dbo.collection("markers").find().sort(sortingOrder).limit(15).toArray(function(err, result) {
      if (err) throw err;
      res.send(result);
      console.log("Sending Top Markers to Client");
      db.close();
    });
  });
}

server.get('/getTopMarkers', function(req, res, next) {
  getTopMarkers(res);
});

server.get('/getControversialMarkers', function(req, res, next) {
  getTopMarkers(res);
});

*/