// 	the process (version 1 - set user to active)
// 		1. send the server the user information (username, password)
//  	2. server will check if the information is valid
//  	3. if the information is valid, set the activity status to the account in the database to true

//	the process (version 2 - validate per action)
//		1. user will login which will store the username and password in the document
//		2. user requests action (upvote/downvote/create marker)
//		3. request will send username and password to server
//		4. server check if information is valid (if valid then preform action)

// VERSION 1
//clientside code
function validateUser() {
	data = {username: document.getElementById('username'), password: document.getElementById('password')};
	$.ajax({
		type: 'POST',
		url: url + '/validateUser',
		async: true,
		data: JSON.stringify(data),
		contentType: 'application/json; charset=utf-8',
		success: function (data) {console.log('changing user votes');},
		error: function(xhr, ajaxOptions, thrownError) {}
	});
}

//serverside code
server.post("/validateUser", (req, res) => {
	res.send('Validating User!');
	validateUser(req.body.username, req.body.password);
});

function validateUser(username, password) {
	MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
		if (err) throw err;
		var dbo = db.db("spot_stop");
		dbo.collection("users").findOne({ username: username, password: password }, function(err, result) {
			if (err) throw err;
			if (result) {
				//preform action
			}
			db.close();
		});
	});

	return false;
}

//VERSION 2
//clientside code
function upvoteMarker(_id, val) {
	data = {username: document.getElementById('username'), password: document.getElementById('password'), _id: _id, val: val};
	$.ajax({
		type: 'POST',
		url: url + '/upvoteMarker',
		async: true,
		data: JSON.stringify(data),
		contentType: 'application/json; charset=utf-8',
		success: function (data) {console.log('changing user votes');},
		error: function(xhr, ajaxOptions, thrownError) {}
	});
}

//serverside code

server.post("/upvoteMarker", (req, res) => {
	res.send('Upvoting Marker!');
	validateUser(req.body.username, req.body.password, req.body._id, req.body._val);
});

function validateUser(username, password, _id, _val) {
	MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
		if (err) throw err;
		var dbo = db.db("spot_stop");
		dbo.collection("users").findOne({ username: username, password: password }, function(err, result) {
			if (err) throw err;
			if (result) {
				//upvote the marker with _id
			}
			db.close();
		});
	});

	return false;
}