var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://test:testpassword@spot-stop-ruq20.mongodb.net/test?retryWrites=true";

var requestedData;

function addMarker(lat, lng, des, upvote, downvote){ 
	MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
		if (err) throw err;
		var dbo = db.db("spot_stop");
		var marker = { lat: lat, lng: lng, des: des, upvote: upvote, downvote: downvote};
		dbo.collection("markers").insertOne(marker, function(err, res) {
		if (err) throw err;
		console.log("Inserted Marker!");
		db.close();
		});
	});
}

function getAllMarkers(res) {
	MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
		if (err) throw err;
		var dbo = db.db("spot_stop");
		dbo.collection("markers").find({}).toArray(function(err, result) {
			if (err) throw err;
			res.send(result);
			db.close();
		});
	}); 
}

function upvoteMarker(lat, lng, val) {
	MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
		if (err) throw err;
		var dbo = db.db("spot_stop");
		var myquery = { lat: lat, lng: lng };
		dbo.collection("markers").findOne({ lat: lat, lng: lng}, function(err, result) {
			if (err) throw err;
			var newvalues = { $set: {upvote: result.upvote + val } };
			dbo.collection("markers").updateOne(myquery, newvalues, function(err, res) {
				if (err) throw err;
				console.log("1 document updated");
			});
			db.close();
		});
	}); 
}

function downvoteMarker(lat, lng, val) {
	MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
		if (err) throw err;
		var dbo = db.db("spot_stop");
		var myquery = { lat: lat, lng: lng };
		dbo.collection("markers").findOne({ lat: lat, lng: lng}, function(err, result) {
			if (err) throw err;
			var newvalues = { $set: {upvote: result.downvote + val } };
			dbo.collection("markers").updateOne(myquery, newvalues, function(err, res) {
				if (err) throw err;
				console.log("1 document updated");
			});
			db.close();
		});
	}); 
}

const express = require('express')
const server = express()
const port = 8080

const bodyParser = require('body-parser');
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({extended: false}));

server.all('/*', function(req, res, next) { 
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Content-Type");
	next();
});

server.get('/getAllMarkers', function(req, res, next) {
	getAllMarkers(res);
});

server.get('/createTestMarker', function(req, res, next) { 
	res.send('Creating Test Marker!') 
	addMarker(34.5315, -123.5235, "Test Marker", 54, 21);
});

server.post("/createMarker", (req, res) => {
	res.send('Creating Marker!');
	addMarker(req.body.lat, req.body.lng, req.body.des, req.body.upvote, req.body.downvote);
});

server.post("/upvoteMarker", (req, res) => {
	res.send('Creating Marker!');
	upvoteMarker(req.body.lat, req.body.lng, req.body.val);
});

server.post("/downvoteMarker", (req, res) => {
	res.send('Creating Marker!');
	downvoteMarker(req.body.lat, req.body.lng, req.body.val);
});

server.listen(port, () => console.log(`Server listening on port ${port}!`))