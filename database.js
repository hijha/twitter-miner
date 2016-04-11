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
            console.log(err)
        } else {
            if (result.length == 0)  {
                collection.insert({"word":word, "count" : 1}, function(err, result) {
                    if (err) {
                        console.log(err)
                    } else {
                        console.log("successful")
                    }
                });
            } else if (result.length == 1) {
                currentValue = result[0].count
                if (!isNaN(currentValue)) {
                    newValue = currentValue + 1
                    update(db, word, newValue)
                }
            }
        }
    });
}

function update(db, word, newValue) {
    var collection = db.collection('dictionary')
    collection.update({"word":word}, {$set: {"count": newValue}}, function (err, updated) {
        if (err) {
            console.log("Error updating value of %s from database", word)
            console.log(err)
        } else if (updated) {
            console.log("Successfully updated the value of %s to %s", word, newValue)
        } else {
            console.log("Word '%s' does not exist in database")
        }
    });
}
