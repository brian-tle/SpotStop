var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://test:testpassword@spot-stop-ruq20.mongodb.net/test?retryWrites=true";

function addMarker(lat, lng, upvote, downvote, des){ 
	MongoClient.connect(url, function(err, db) {
		if (err) throw err;
		var dbo = db.db("spot_stop");
		var marker = { lat: lat, lng: lng, des: des, upvote: upvote, downvote: downvote};
		dbo.collection("markers").insertOne(marker, function(err, res) {
		if (err) throw err;
		console.log("1 document inserted");
		db.close();
		});
	});
}

addMarker(0.0, 0.0, 5, 7, "HELLO WORLD");