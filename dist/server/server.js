const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID
const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

const url = "mongodb://test:testpassword@spot-stop-shard-00-00-ruq20.mongodb.net:27017,spot-stop-shard-00-01-ruq20.mongodb.net:27017,spot-stop-shard-00-02-ruq20.mongodb.net:27017/test?ssl=true&replicaSet=spot-stop-shard-0&authSource=admin&retryWrites=true";
const server = express()
const port = 8080
const path  = require('path')

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({extended: false}));

var ip;
var requestedData;
var clientList = [];

function addMarker(lat, lng, des, upvote, downvote){ 
	MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
		if (err) throw err;
		var dbo = db.db("spot_stop");
		var marker = { lat: lat, lng: lng, des: des, upvote: upvote, downvote: downvote};
		dbo.collection("markers").insertOne(marker, function(err, res) {
			if (err) throw err;
			console.log("Inserted Marker at { " + lat + ", " + lng + " }");
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
			console.log("Sending Markers to Client");
			db.close();
		});
	}); 
}

function upvoteMarker(_id, val) {
	MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
		if (err) throw err;
		var dbo = db.db("spot_stop");
		var myquery = {  _id: ObjectId(_id) };
		dbo.collection("markers").findOne({ _id: ObjectId(_id) }, function(err, result) {
			if (err) throw err;
			var newvalues = { $set: {upvote: result.upvote + val } };
			dbo.collection("markers").updateOne(myquery, newvalues, function(err, res) {
				if (err) throw err;
				if (val > 0) {
					console.log("Upvoted Marker with { _id: " + _id + " }");
				}
			});
			db.close();
		});
	}); 
}

function downvoteMarker(_id, val) {
	MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
		if (err) throw err;
		var dbo = db.db("spot_stop");
		var myquery = {  _id: ObjectId(_id) };
		dbo.collection("markers").findOne({  _id: ObjectId(_id) }, function(err, result) {
			if (err) throw err;
			var newvalues = { $set: {downvote: result.downvote + val } };
			dbo.collection("markers").updateOne(myquery, newvalues, function(err, res) {
				if (err) throw err;
				if (val > 0) {
					console.log("Downvoted Marker with { _id: " + _id + " }");
				}
			});
			db.close();
		});
	}); 
}

function sendMail(req) {
	const output = req.body.message + '<br/>by ' + req.body.email;
	let transporter = nodemailer.createTransport({
	  service: 'gmail.com',
	  port: 587,
	  auth: {
		  user: 'spotstopsfhack2019@gmail.com',
		  pass: 'sfhack2019'
	  }
	});
	let mailOptions = {
	  from: `shotaebikawa@gmail.com`,
	  to: 'spotstopsfhack2019@gmail.com',
	  subject: req.body.name,
	  html: output
	};
	transporter.sendMail(mailOptions, function(error, info) {
	  if (error) {
		return console.log(error);
	  }
	  console.log('Message sent: %s', info.messageId);
	  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
	});
}

server.all('/*', function(req, res, next) { 
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Content-Type");
	next();
});

server.get('https://sfhacks2019-1551558382883.appspot.com/homepage', function(req, res) {
	res.sendFile(path.resolve("../home.html"));
});

server.get('/getAllMarkers', function(req, res, next) {
	getAllMarkers(res);
	ip = (req.headers['x-forwarded-for'] || req.connection.remoteAddress).toString();
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
	res.send('Upvoting Marker!');
	upvoteMarker(req.body._id, req.body.val);
});

server.post("/downvoteMarker", (req, res) => {
	res.send('Downvoting Marker!');
	downvoteMarker(req.body._id, req.body.val);
});

server.post('/sendmail', (req, res) => {
	sendMail(req); 
	res.send({
		msg: 'Email has been sent!'
	});
	
});

server.listen(port, () => console.log(`Server listening on port ${port}!`));