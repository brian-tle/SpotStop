const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const url = "mongodb://test:testpassword@spot-stop-shard-00-00-ruq20.mongodb.net:27017,spot-stop-shard-00-01-ruq20.mongodb.net:27017,spot-stop-shard-00-02-ruq20.mongodb.net:27017/test?ssl=true&replicaSet=spot-stop-shard-0&authSource=admin&retryWrites=true";
const server = express();
server.use(cookieParser());
const port = 8080;
const path  = require('path');

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({extended: false}));

function handleClient(ip) {
	MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
		if (err) throw err;
		var dbo = db.db("spot_stop");
		dbo.collection("clients").findOne({ ip: ip }, function(err, result) {
			if (err) throw err;
			if (!result) { addClient(ip); }
			db.close();
		});
	});
}

function handleMarkerC(ip, _id) {
	MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
		if (err) throw err;
		var dbo = db.db("spot_stop");
		dbo.collection("clients").findOne({ip: ip}, function(err, result) {
			if (err) throw err;
			if (result) {
				dbo.collection("clients").updateOne({ip: ip}, { $push: { markerListC: _id } });
			}
			db.close();
		});
	});
}

function handleUpvoteMarkerM(ip, _id) {
	MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
		if (err) throw err;
		var dbo = db.db("spot_stop");
		dbo.collection("clients").findOne({ ip: ip }, function(err, result) {
			if (err) throw err;
			if (result) {
				handleUpvoteDecision(ip, _id);
			}
			db.close();
		});
	});

	return false;
}

function handleUpvoteDecision(ip, _id) {
	MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
		if (err) throw err;
		var dbo = db.db("spot_stop");
		dbo.collection("clients").findOne({ ip: ip, markerListM: {$elemMatch: {_id: _id}} }, function(err, result) {
			if (err) throw err;
			if (result) { 
				handleUpvoteSwitch(ip, _id);
			}
			else {
				dbo.collection("clients").updateOne({ip: ip}, { $push: { markerListM: {_id: _id, value: 1} } });
				upvoteMarker(_id, 1);
			}
			db.close();
		});
	});
}

function handleUpvoteSwitch(ip, _id) {
	MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
		if (err) throw err;
		var dbo = db.db("spot_stop");
		dbo.collection("clients").findOne({ ip: ip, markerListM: {$elemMatch: {_id: _id, value: -1}} }, function(err, result) {
			if (err) throw err;
			if (result) { 
				dbo.collection("clients").updateOne({ip: ip}, { $pull: { markerListM: {_id: _id, value: -1} } });
				dbo.collection("clients").updateOne({ip: ip}, { $push: { markerListM: {_id: _id, value: 1} } });
				upvoteMarker(_id, 1);
				downvoteMarker(_id, -1);
			}
			db.close();
		});
	});
}

function handleDownvoteMarkerM(ip, _id) {
	MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
		if (err) throw err;
		var dbo = db.db("spot_stop");
		dbo.collection("clients").findOne({ ip: ip }, function(err, result) {
			if (err) throw err;
			if (result) {
				handleDownvoteDecision(ip, _id);
			}
			db.close();
		});
	});

	return false;
}

function handleDownvoteDecision(ip, _id) {
	MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
		if (err) throw err;
		var dbo = db.db("spot_stop");
		var client = { ip: ip, markerListM: [], markerListC: [] };
		dbo.collection("clients").findOne({ ip: ip, markerListM: {$elemMatch: {_id: _id}} }, function(err, result) {
			if (err) throw err;
			if (result) { 
				handleDownvoteSwitch(ip, _id);
			}
			else {
				dbo.collection("clients").updateOne({ip: ip}, { $push: { markerListM: {_id: _id, value: -1} } });
				downvoteMarker(_id, 1);
			}
			db.close();
		});
	});
}

function handleDownvoteSwitch(ip, _id) {
	MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
		if (err) throw err;
		var dbo = db.db("spot_stop");
		dbo.collection("clients").findOne({ ip: ip, markerListM: {$elemMatch: {_id: _id, value: 1}} }, function(err, result) {
			if (err) throw err;
			if (result) { 
				dbo.collection("clients").updateOne({ip: ip}, { $pull: { markerListM: {_id: _id, value: 1} } });
				dbo.collection("clients").updateOne({ip: ip}, { $push: { markerListM: {_id: _id, value: -1} } });
				downvoteMarker(_id, 1);
				upvoteMarker(_id, -1);
			}
			db.close();
		});
	});
}


function handleUser(user, em, pass) {
	MongoClient.connect(url, {useNewUrlParser: true}, function(err, db) {
		if (err) throw err;
		var dbo = db.db("spot_stop");
		var salt = bcrypt.genSaltSync(10);
		var new_pass = bcrypt.hashSync(pass, salt);
		var yuza = {username: user, email: em, password: new_pass, marker: [], rating: []};
		dbo.collection("users").insertOne(yuza, function(err, result) {
			if (err) throw err;
			console.log("User {" + user +"} added");
			console.log(new_pass);
			db.close();
		});
	});
}


/**
 * checkUser is a function where it checks whether user's input password
 * matches the encrypted password in the database.
 * 1) It checks to see if parameter user matches the users collections's document's username
 * 2) If it matches, variable new_pass will store the given document's encrypted password
 * 3) bcrypt will be used to check whether parameter password (which is user's input password)
 *    matches new_pass (the encrypted password)
 * 4) If it matches, it will return true to logIn() function in client.js
 *    otherwise, it will return false to logIn() function in client.js
 * 
 */
function checkUser(res, user, pass) {
	// stores encrypted password
	var new_pass;
	// connect to the database
	MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
		if (err) throw err;
		var dbo = db.db("spot_stop");
		const user_collection = dbo.collection("users");
		//Find the users collection's document's username that
		// matches with user parameter
		user_collection.findOne({ username: user }, function (err, docs) {
			if (err) throw err;
			// assign the document's encrypted
			// password to new_pass by calling
			// docs.password. This works because
			// docs is dictionary that stores the
			// the given document's information.
			new_pass = docs.password;
			// use bcrypt to compare pass (inputed password)
			// and new_pass (encrypted password)
			bcrypt.compare(pass, new_pass, function (err, resp) {
				if (err) throw err;
				// returns true to client.js if it matches
				if (resp == true) {
					console.log("You have signed in to your account!");
					res.send('cookie sent');
					check = true;
				}
				// return false to cleint.js if it doesn't match
				else {
					return res.status(400).send({
						message: 'Password does not match'
					 });
				}
			});
			db.close();
		});
	});
}

function addClient(ip) {
	MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
		if (err) throw err;
		var dbo = db.db("spot_stop");
		var client = { ip: ip, markerListM: [], markerListC: [] };
		dbo.collection("clients").insertOne(client, function(err, result) {
			if (err) throw err;
			console.log("Inserted Client with IP { " + client.ip + " }");
			db.close();
		});
	});
}

function addMarker(res, ip, name, lat, lng, des, upvote, downvote){ 
	MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
		if (err) throw err;
		var dbo = db.db("spot_stop");
		var marker = { lat: lat, lng: lng, name:name,des: des, upvote: upvote, downvote: downvote};
		dbo.collection("markers").insertOne(marker, function(err, result) {
			if (err) throw err;
			res.send(marker._id);
			console.log("Inserted Marker at { " + lat + ", " + lng + " } with ID { " + marker._id + " }");
			handleMarkerC(ip, marker._id);
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

function getAllUsers(res) {
	MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
		if (err) throw err;
		var dbo = db.db("spot_stop");
		dbo.collection("users").find({}).toArray(function(err, result) {
			if (err) throw err;
			res.send(result);
			console.log("Sending Users Data");
			db.close();
		});
	}); 
}

function addUserVotes(id, name) {
	MongoClient.connect(url, { useNewUrlParser: true}, function(err, db){
		if (err) throw err;
		var dbo = db.db("spot_stop");
		var query = {username: name};
		dbo.collection("users").findOne({username: name}, function(err, result){
			if (err) throw err;
			var userRating = {$set: {rating: id}};
			dbo.collection("users").updateOne(query, userRating, function(err){
				if (err) throw err;
			});
			//var updates = {}
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

server.all('/*', function(req, res, next) { 
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Content-Type");
	next();
});

server.get('/getTopMarkers', function(req, res, next) {
	getTopMarkers(res);
});

server.get('/getControversialMarkers', function(req, res, next) {
	getTopMarkers(res);
});

server.get('/getAllMarkers', function(req, res, next) {
	getAllMarkers(res);
	var ip = (req.headers['x-forwarded-for'] || req.connection.remoteAddress).toString();
	handleClient(ip);
});

server.get('/getAllUsers', function(req, res, next) {
	getAllUsers(res);
});

server.get('/getC', function(req, res){
	res.cookie('name',res.username, {'maxAge': 1000 * 60 * 30}).send('cookie set'); //Sets name = express
	res.send('Passed Cookie');
 });
 

server.get('/createTestMarker', function(req, res, next) { 
	res.send('Creating Test Marker!') 
	addMarker(res, 34.5315, -123.5235, "Test Marker", 54, 21);
});

server.post("/createMarker", (req, res) => {
	var ip = (req.headers['x-forwarded-for'] || req.connection.remoteAddress).toString();
	addMarker(res, ip, req.body.name, req.body.lat, req.body.lng, req.body.des, req.body.upvote, req.body.downvote);
});

server.post("/upvoteMarker", (req, res) => {
	res.send('Upvoting Marker!');
	var ip = (req.headers['x-forwarded-for'] || req.connection.remoteAddress).toString();
	handleUpvoteMarkerM(ip, req.body._id);
});

server.post("/downvoteMarker", (req, res) => {
	res.send('Downvoting Marker!');
	var ip = (req.headers['x-forwarded-for'] || req.connection.remoteAddress).toString();
	handleDownvoteMarkerM(ip, req.body._id);
});

server.post("/addUser", (req, res) => {
	res.send('Adding User!');
	handleUser(req.body.username, req.body.email, req.body.password);
});

server.post("/addUserVotes", (req,res) => {
	res.send('Adding User Votes!');
	addUserVotes(req.body.rating, req.body.username);
});

server.post("/login", (req, res) => {
	checkUser(res, req.body.username, req.body.password);
});

server.listen(port, () => console.log(`Server listening on port ${port}!`));