var exports = module.exports = {}

var mongodb = require('mongodb')

var MongoClient = mongodb.MongoClient;
var url = 'mongodb://localhost:27017/myTestDB';

exports.connectToDatabase = function (callback) {
	MongoClient.connect(url, function (err, db) {
        if (err) {
            console.log('Unable to connect to the mongoDB server. Error:', err);
        } else {
            console.log('Connection established to', url);
        }
        return callback(db)
    });
}


exports.insert = function (db, word) {
    var collection = db.collection('dictionary')
    collection.find({"word":word}).toArray(function (err, result) {
        if (err) {
            console.log("Error reading value of %s from database", word)
        } else {
            var newCount
            //TODO :: if the value already exists, need to update value, not just insert
            if (result.length == 0)  {
                newCount = 1
            } else if (result.length == 1) {
                currentValue = result[0].count
                if (isNaN(currentValue)) {
                    newCount = 0
                } else {
                    newCount  = currentValue + 1
                }
            }
            collection.insert({"word":word, "count" : newCount}, function(err, result) {
                if (err) {
                    console.log(err)
                } else {
                    console.log("successful")
                }
            });
        }
    });
}
