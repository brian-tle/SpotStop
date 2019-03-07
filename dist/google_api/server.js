const nodemailer = require('nodemailer');
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
				if (val > 0) {
					console.log("Upvoted Marker at { " + lat + ", " + lng + " }");
				}
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
			var newvalues = { $set: {downvote: result.downvote + val } };
			dbo.collection("markers").updateOne(myquery, newvalues, function(err, res) {
				if (err) throw err;
				if (val > 0) {
					console.log("Downvoted Marker at { " + lat + ", " + lng + " }");
				}
			});
			db.close();
		});
	}); 
}

function sendMail(req) {
	const output = '<p> You have a new email'
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
	  subject: 'User Form Contact',
	  body: req.body.message
	};
	transporter.sendMail(mailOptions, function(error, info) {
	  if (error) {
		return console.log(error);
	  }
	  console.log('Message sent: %s', info.messageId);
	  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
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

server.post('/sendmail', (req, res) => {
	sendMail(req); 
	res.send({
		msg: 'Email has been sent!'
	  });
  });

server.listen(port, () => console.log(`Server listening on port ${port}!`))