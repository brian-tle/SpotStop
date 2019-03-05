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

const express = require('express')
const server = express()
const port = 8080

server.all('/*', function(req, res, next) { 
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	next();
});

server.get('/create_test_marker', function(req, res, next) { 
	res.send('Creating Test Marker!') 
	addMarker(34.5315, -123.5235, 54, 21, "Test Marker");
});

server.listen(port, () => console.log(`Example server listening on port ${port}!`))