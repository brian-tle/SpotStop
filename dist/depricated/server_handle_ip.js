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