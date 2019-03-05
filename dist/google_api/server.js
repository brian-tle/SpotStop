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

//for shota
//     client sends command to server
//     server grabs data from database
//     server sends data to client

// we have 3 different services
//      1. html web page
//      2. node.js server
//      3. our our database

// to launch a local server run (node server.js)
// connect to it with (localhost:3000) on your browser

const express = require('express')
const server = express()
const port = 8080

server.get('/hello', (req, res) => res.send('Hello World!'))
server.listen(port, () => console.log(`Example server listening on port ${port}!`))