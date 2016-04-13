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

exports.insert = function (db, wordArray, callback) {
    var collection = db.collection('dictionary')
    collection.bulkWrite(wordArray.map(function(word) {
        return {"updateOne" : {"filter" : {"word" : word},
                        "update" : {"$inc" : {"count" : 1 } }, 
                        "upsert" : true } }
    }), function (err, result) {
        callback(null, result)
    });
}

function update(db, word, newValue, callback) {
    var collection = db.collection('dictionary')
    collection.update({"word":word}, {$set: {"count": newValue}}, function (err, updated) {
        if (err) {
            callback(err)
        } else if (updated) {
            callback(null, "Success")
        } else {
            err = "Word " + word + " does not exist in database"
            callback(err)
        }
    });
}
