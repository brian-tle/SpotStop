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

function getAccountType(res, username) {
	MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
		if (err) throw err;
		var dbo = db.db("spot_stop");
		dbo.collection("users").findOne({username: username}, function(err, result) {
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
		var yuza = {username: user, email: em, password: new_pass, type: 0, marker: [], rating: []};
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

function addMarker(res, name, lat, lng, des, upvote, downvote){ 
	MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
		if (err) throw err;
		var dbo = db.db("spot_stop");
		var marker = { lat: lat, lng: lng, name:name, des: des, upvote: upvote, downvote: downvote};
		dbo.collection("markers").insertOne(marker, function(err, result) {
			if (err) throw err;
			res.send(marker._id);
			console.log("Inserted Marker at { " + lat + ", " + lng + " } with ID { " + marker._id + " }");
			db.close();
		});
	});
}

function deleteMarker(res, _id) {
	MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
		if (err) throw err;
		var dbo = db.db("spot_stop");
		var myquery = { _id: ObjectId(_id) };
		dbo.collection("markers").deleteOne(myquery, function(err, obj) {
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
		dbo.collection("users").findOne({ username: username }, function (err, result) {
			if (err) throw err;
			if (result) {
				addMarker(res, name, lat, lng, des, upvote, downvote);
			}
			db.close();
		});
	});
}

function deleteMarkerUser(res, username, _id) {
	MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
		if (err) throw err;
		var dbo = db.db("spot_stop");
		dbo.collection("users").findOne({ username: name, type: 1 }, function (err, result) {
			if (err) throw err;
			if (result) {
				deleteMarker(res, _id);
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
		var query = { username: name };
		var userRating = [];
		// to check if certain condition is passed
		var check = 0;
		/**
		 * Find the user, from users collection, with same username stored in the cookie.
		 * userRating will store the rating list in the given users document .
		 * */ 
		dbo.collection("users").findOne({ username: name }, function (err, result) {
			if (err) throw err;
			userRating = result.rating;
			/**
			 * If userRating is NOT empty,
			 * iterate through userRating and IF userRating.marker_id matches the id,
			 * check if the value of that marker_id equals to 1. If it equals to 1, 
			 * assign check to 2 and
			 * return res.send of 400 connection error.
			 * BUT if it doesn't equal to 1, change the value to 1, assign check to 1
			 * and break the loop.
			 */
			if (userRating.length > 0) {
				for (var key in userRating) {
					if (userRating.hasOwnProperty(key)) {
						if (userRating[key].marker_id == id) {
							if (userRating[key].value == 1) {
								check = 2;
								return res.status(400).send({
									message: 'User has already upvoted this marker!'
								});
							}
							else if (userRating[key].value < 1) {
								userRating[key] = { marker_id: id, value: 1 };
								check = 1;
								break;
							}
						}
					}
				}
				/**
				 * IF none of the marker_id matches the given id,
				 * push the dictionary object containing marker_id and value to the
				 * userRating
				 */
				if (check == 0) {
					userRating.push({ marker_id: id, value: 1 });
				}
			}
			/**
			 * IF userRating is empty, push the dictionary object
			 * containing marker_id and value to the 
			 * userRating
			 */
			else {
				userRating.push({ marker_id: id, value: 1 });
			}
			/**
			 * If check is LESS than 2 (IF the given value of the marker_id DOES NOT EQUAL to 1),
			 * update the user document's rating list by reassigning userRating to it and 
			 * call upvoteMarker() function after that
			 */
			if (check < 2) {
				dbo.collection("users").updateOne(query, { $set: { rating: userRating } }, function (err) {
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
		var userRating = [];
		// check if the certain condition is passed
		var check = 0;
		// find the user, in the users collection, that matches the username stored in the cookie
		dbo.collection("users").findOne({ username: name }, function (err, result) {
			if (err) throw err;
			// store result list into userRating
			userRating = result.rating;
			/**
			 * IF userRating is NOT empty,
			 * iterate through userRating and
			 * IF the marker_id matches the given id, 
			 * check if the value of the certain marker equals -1.
			 * IF it equals -1, return response of 400 error.
			 * ELSE, change the value of the marker to -1 (TO VALIDATE THAT IT'S DOWNVOTED)
			 * and break the loop afterwards
			 */
			if (userRating.length > 0) {
				for (var key in userRating) {
					if (userRating.hasOwnProperty(key)) {
						if (userRating[key].marker_id == id) {
							if (userRating[key].value == -1) {
								check = 2;
								return res.status(400).send({
									message: "User has already downvoted this marker!"
								});
							} else if (userRating[key].value > -1) {
								userRating[key] = { marker_id: id, value: -1 };
								check = 1;
								break;
							}
						}
					}
				}
				/**
				 * IF none of the marker_id matches the given id,
				 * push the dictionary object of marker_id and value 
				 * to userRating
				 */
				if (check == 0) {
					userRating.push({ marker_id: id, value: -1 });
				}
			/**
			 * IF userRating is EMPTY,
			 * push the dictionary object of marker_id and value
			 * to userRating
			 */
			} else {
				userRating.push({ marker_id: id, value: -1 });
			}
			/**
			 * IF the value of the given marker is NOT -1 (OR check != 2),
			 * update the rating list of users document by reassigning
			 * it to userRating and call downvoteMarker() function to downvote the
			 * marker.
			 */
			if (check < 2) {
				dbo
					.collection("users")
					.updateOne(query, { $set: { rating: userRating } }, function (err) {
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

server.get('/getC', function(req, res){
	res.cookie('name',res.username, {'maxAge': 1000 * 60 * 30}).send('cookie set'); //Sets name = express
	res.send('Passed Cookie');
 });

server.post("/getAccountType", (req, res) => {
	getAccountType(res, req.body.username);
});

server.post("/createMarker", (req, res) => {
	addMarkerUser(res, req.body.username, req.body.name, req.body.lat, req.body.lng, req.body.des, req.body.upvote, req.body.downvote);
});

server.post("/deleteMarker", (req, res) => {
	deleteMarkerUser(req.body.username, res, req.body._id);
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
	checkUser(res, req.body.username, req.body.password);
});

server.listen(port, () => console.log(`Server listening on port ${port}!`));