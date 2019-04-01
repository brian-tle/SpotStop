server.get('/getAllUsers', function(req, res, next) {
	getAllUsers(res);
});

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