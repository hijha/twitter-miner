var exports = module.exports = {}

var mongodb = require('mongodb')

var MongoClient = mongodb.MongoClient;
var url = 'mongodb://localhost:27017/myTestDB';

var userHandle;

exports.connectToDatabase = function (handle, callback) {
    userHandle = handle;
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

/*
    Function to read a specified number of values (count)
    from the database, which is read in a sorted manner
*/
exports.getCommonWords = function (db, count, callback) {
    var collection = db.collection('dictionary')

    var cursor = collection.find().sort({'count': -1}).limit(count)
    cursor.forEach(function (entry) {
        if (entry != null) {
            callback(null, entry.word)
        }
    });
}

function insertCallback(word) {
    return { "updateOne" : {
                "filter" : {"handle" : userHandle, "word" : word},
                "update" : {"$inc"   : {"count" : 1 } },
                "upsert" : true }
    }
}
