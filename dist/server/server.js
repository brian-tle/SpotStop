const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const url = "mongodb://test:testpassword@spot-stop-shard-00-00-ruq20.mongodb.net:27017,spot-stop-shard-00-01-ruq20.mongodb.net:27017,spot-stop-shard-00-02-ruq20.mongodb.net:27017/test?ssl=true&replicaSet=spot-stop-shard-0&authSource=admin&retryWrites=true";
const server = express();
server.use(cookieParser());
const PORT = 8080;
const path  = require('path');

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({extended: false}));

function getAccountType(res, username) {
	MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
		if (err) throw err;
		var dbo = db.db("spot_stop");
		dbo.collection("users").findOne({ cookie: username }, function (err, result) {
			if (err) throw err;
			res.send({type: result.type});
			console.log("User {" + username + "} is type: " + result.type);
			db.close();
		});
	});
}

function handleUser(res, user, em, pass) {
	MongoClient.connect(url, {useNewUrlParser: true}, function(err, db) {
		if (err) throw err;
		var dbo = db.db("spot_stop");
		var salt = bcrypt.genSaltSync(10);
		var new_pass = bcrypt.hashSync(pass, salt);
		//type: 0 = regular account
		//type: 1 = admin account
		var yuza = {username: user, email: em, password: new_pass, type: 0, markerListC: [], markerListM: [], cookie:''};
		dbo.collection("users").insertOne(yuza, function(err, result) {
			if (err) throw err;
			console.log("User {" + user +"} added");
			console.log(new_pass);
			db.close();
		});
	});
}

function validateNewUser(res, user, em, pass) {
	MongoClient.connect(url, {useNewUrlParser: true}, function(err, db){
		if (err) throw err;
		var dbo = db.db("spot_stop");
		dbo.collection("users").find({}).toArray( function(err, result){
			for (var key in result) {
				if (result.hasOwnProperty(key)) {
					if (user == result[key].username || em == result[key].email) {
						return res.status(400).send({
							message: "Username or email already taken"
						});
					}
				}
			}
			handleUser(res,user,em,pass)
			db.close();
			return res.send("Added new user");
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
function checkUser(req, res, user, pass) {
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
					console.log(user + " has signed in to their account!");
					assignCookie(req, res, user)
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

function assignCookie(req, res, user) {
	bcrypt.hash(user, 10, function(err, result){
		MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
			if (err) throw err;
			var dbo = db.db("spot_stop");
		dbo.collection("users").updateOne({username:user}, { $set: { cookie: result } }, function (err) {
			if (err) throw err;
		});
		db.close();
		});
		res.send(result);
	});
}

function MarkerValidation(res, username, name, lat, lng, des, upvote, downvote) {
	MongoClient.connect(url, { useNewUrlParser: true}, function(err, db){
		if (err) throw err;
		var dbo = db.db("spot_stop");
		dbo.collection("users").findOne({cookie:username}, function(err, result){
			addMarker(res, result.username, name, lat, lng, des, upvote, downvote);
		});
	});
}

function addMarker(res, username, name, lat, lng, des, upvote, downvote){ 
	MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
		if (err) throw err;
		var dbo = db.db("spot_stop");
		var marker = { lat: lat, lng: lng, name:name, des: des, upvote: upvote, downvote: downvote, user: username};
		dbo.collection("markers").insertOne(marker, function(err, result) {
			if (err) throw err;
			console.log("Inserted Marker at { " + lat + ", " + lng + " } with ID { " + marker._id + " }");
			handleMarkerC(res, username, marker._id);
			db.close();
		});
	});
}

function handleMarkerC(res, username, _id) {
	MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
		if (err) throw err;
		var dbo = db.db("spot_stop");
		var dummyUser = [];
		dbo.collection("users").findOne({username: username}, function(err, result) {
			if (err) throw err;
			if (result) {
				dummyUser = result.markerListC;
				console.log(dummyUser);
				dummyUser.push(_id);
				console.log(dummyUser);
				dbo.collection("users").updateOne({username: username}, { $set: { markerListC: dummyUser } });
			}
			res.send(_id);
			db.close();
		});
	});
}

function deleteMarkerHistory(res, _id) {
	MongoClient.connect(url, {useNewUrlParser: true }, function(err, db){
		if (err) throw err;
		var dbo = db.db("spot_stop");
		var marker = {_id: ObjectId(_id) };
		var dummy_User = [];
		var dummy_Rating = [];
		var username = '';
		dbo.collection("markers").findOne(marker, function(err, result) {
			if (err) throw err;
			if (result) {
				username = result.user;
				console.log(username);
			}
			dbo.collection("users").findOne({username: username}, function(err, result) {
				if (err) throw err;
				dummy_User = result.markerListC;
				dummy_Rating = result.markerListM;
				for (var i = 0; i < dummy_User.length; i++) {
					if (dummy_User[i] == ObjectId(_id)) dummy_User.splice(i,1);
				}
				for (var i = 0; i < dummy_Rating.length; i++) {
					if (dummy_Rating[i]['marker_id'] == ObjectId(_id)) dummy_Rating.splice(i, 1);
				}
				console.log(dummy_User);
				dbo.collection("users").updateOne({username: username}, {$set: { markerListC: dummy_User}});
				dbo.collection("users").updateOne({username: username}, {$set: {markerListM: dummy_Rating }});
				deleteMarker(res, _id);
				db.close();
			});
			
		});
	});
}

function deleteMarker(res, _id) {
	MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
		if (err) throw err;
		var dbo = db.db("spot_stop");
		var marker = { _id: ObjectId(_id) };
		dbo.collection("markers").deleteOne(marker, function(err, obj) {
			if (err) throw err;
			res.send(marker._id);
			console.log("Deleted Marker with { _id: " + _id + " }");

			db.close();
		});
	}); 
}

function upvoteMarker(_id, val) {
	MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
		if (err) throw err;
		var dbo = db.db("spot_stop");
		var myquery = {  _id: (ObjectId(_id)) };
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
		var myquery = {  _id: (ObjectId(_id)) };
		dbo.collection("markers").findOne({  _id: (ObjectId(_id)) }, function(err, result) {
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

function addMarkerUser(res, username, name, lat, lng, des, upvote, downvote) {
	MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
		if (err) throw err;
		var dbo = db.db("spot_stop");
		dbo.collection("users").findOne({ cookie: username }, function (err, result) {
			if (err) throw err;
			if (result) {
				addMarker(res, username, name, lat, lng, des, upvote, downvote);
			}
			db.close();
		});
	});
}

function deleteMarkerUser(res, username, _id) {
	MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
		if (err) throw err;
		var dbo = db.db("spot_stop");
		dbo.collection("users").findOne({ cookie: username}, function (err, result) {
			if (err) throw err;
			if (result && result.type == 1) {
				deleteMarkerHistory(res, _id);
			}
			db.close();
		});
	});
}


function upvoteUser(res, id, name, rating) {
	// open the database
	MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
		if (err) throw err;
		var dbo = db.db("spot_stop");
		//var query = { username: name };
		var userMarkerListM = [];
		// to check if certain condition is passed
		var check = 0;
		/**
		 * Find the user, from users collection, with same username stored in the cookie.
		 * userMarkerListM will store the rating list in the given users document .
		 * */ 
		dbo.collection("users").findOne({ cookie: name }, function (err, result) {
			if (err) throw err;
			userMarkerListM = result.markerListM;
			/**
			 * If userMarkerListM is NOT empty,
			 * iterate through userMarkerListM and IF userMarkerListM.marker_id matches the id,
			 * check if the value of that marker_id equals to 1. If it equals to 1, 
			 * assign check to 2 and
			 * return res.send of 400 connection error.
			 * BUT if it doesn't equal to 1, change the value to 1, assign check to 1
			 * and break the loop.
			 */
			if (userMarkerListM.length > 0) {
				for (var key in userMarkerListM) {
					if (userMarkerListM.hasOwnProperty(key)) {
						if (userMarkerListM[key].marker_id == id) {
							if (userMarkerListM[key].value == 1) {
								check = 2;
								return res.status(400).send({
									message: 'User has already upvoted this marker!'
								});
							}
							else if (userMarkerListM[key].value < 1) {
								userMarkerListM[key] = { marker_id: id, value: 1 };
								check = 1;
								break;
							}
						}
					}
				}
				/**
				 * IF none of the marker_id matches the given id,
				 * push the dictionary object containing marker_id and value to the
				 * userMarkerListM
				 */
				if (check == 0) {
					userMarkerListM.push({ marker_id: id, value: 1 });
				}
			}
			/**
			 * IF userMarkerListM is empty, push the dictionary object
			 * containing marker_id and value to the 
			 * userMarkerListM
			 */
			else {
				userMarkerListM.push({ marker_id: id, value: 1 });
			}
			/**
			 * If check is LESS than 2 (IF the given value of the marker_id DOES NOT EQUAL to 1),
			 * update the user document's rating list by reassigning userMarkerListM to it and 
			 * call upvoteMarker() function after that
			 */
			if (check < 2) {
				dbo.collection("users").updateOne({cookie: name}, { $set: { markerListM: userMarkerListM } }, function (err) {
					if (err) throw err;
				});
			}
			if (check < 2) {
				upvoteMarker(id, 1);
			}
			db.close();
			return res.send("Success");
		});
	});
}

function downvoteUser(res, id, name, rating) {
	// open the database
	MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
		if (err) throw err;
		var dbo = db.db("spot_stop");
		var query = { username: name };
		var userMarkerListM = [];
		// check if the certain condition is passed
		var check = 0;
		// find the user, in the users collection, that matches the username stored in the cookie
		dbo.collection("users").findOne({ cookie: name }, function (err, result) {
			if (err) throw err;
			// store result list into userMarkerListM
			userMarkerListM = result.markerListM;
			/**
			 * IF userMarkerListM is NOT empty,
			 * iterate through userMarkerListM and
			 * IF the marker_id matches the given id, 
			 * check if the value of the certain marker equals -1.
			 * IF it equals -1, return response of 400 error.
			 * ELSE, change the value of the marker to -1 (TO VALIDATE THAT IT'S DOWNVOTED)
			 * and break the loop afterwards
			 */
			if (userMarkerListM.length > 0) {
				for (var key in userMarkerListM) {
					if (userMarkerListM.hasOwnProperty(key)) {
						if (userMarkerListM[key].marker_id == id) {
							if (userMarkerListM[key].value == -1) {
								check = 2;
								return res.status(400).send({
									message: "User has already downvoted this marker!"
								});
							} else if (userMarkerListM[key].value > -1) {
								userMarkerListM[key] = { marker_id: id, value: -1 };
								check = 1;
								break;
							}
						}
					}
				}
				/**
				 * IF none of the marker_id matches the given id,
				 * push the dictionary object of marker_id and value 
				 * to userMarkerListM
				 */
				if (check == 0) {
					userMarkerListM.push({ marker_id: id, value: -1 });
				}
			/**
			 * IF userMarkerListM is EMPTY,
			 * push the dictionary object of marker_id and value
			 * to userMarkerListM
			 */
			} else {
				userMarkerListM.push({ marker_id: id, value: -1 });
			}
			/**
			 * IF the value of the given marker is NOT -1 (OR check != 2),
			 * update the rating list of users document by reassigning
			 * it to userMarkerListM and call downvoteMarker() function to downvote the
			 * marker.
			 */
			if (check < 2) {
				dbo
					.collection("users")
					.updateOne({cookie: name}, { $set: { markerListM: userMarkerListM } }, function (err) {
						if (err) throw err;
					});
			}
			if (check < 2) {
				downvoteMarker(id, 1);
			}
			db.close();
			return res.send("Success");
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
});

server.post("/getAccountType", (req, res) => {
	getAccountType(res, req.body.username);
});

server.post("/createMarker", (req, res) => {
	MarkerValidation(res, req.body.username, req.body.name, req.body.lat, req.body.lng, req.body.des, req.body.upvote, req.body.downvote);
});

server.post("/deleteMarker", (req, res) => {
	deleteMarkerUser(res, req.body.cookie, req.body.marker_id);
});

server.post("/addUser", (req, res) => {
	validateNewUser(res, req.body.username, req.body.email, req.body.password);
});

server.post("/upvoteUser", (req,res) => {
	upvoteUser(res, req.body.marker_id, req.body.username, req.body.rating);
});

server.post("/downvoteUser", (req, res) => {
	downvoteUser(res, req.body.marker_id, req.body.username, req.body.rating);
});

server.post("/login", (req, res) => {
	checkUser(req, res, req.body.username, req.body.password);
});

server.listen(PORT, () => console.log(`Server listening on port ${PORT}!`));