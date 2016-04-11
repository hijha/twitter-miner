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
    var currentValue
    collection.find({"word":word}).toArray(function (err, result) {
        currentValue = result[0].count
        newCount  = currentValue + 1
        collection.insert({"word":word, "count" : newCount}, function(err, result) {
            if (err) {
                console.log(err)
            } else {
                console.log("successful")
            }
        });
    });
}
