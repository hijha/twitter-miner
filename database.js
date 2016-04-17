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

    collection.bulkWrite(wordArray.map(insertCallback), function (err, result) {
            if (err) {
                console.log(err)
            } else {
                callback(null, result)
            }
        });
}

function insertCallback(word) {
    return { "updateOne" : {
                "filter" : {"word" : word},
                "update" : {"$inc"   : {"count" : 1 } },
                "upsert" : true }
    }
}
