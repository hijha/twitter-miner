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


exports.insert = function (db, word, callback) {
    var collection = db.collection('dictionary')
    collection.find({"word":word}).toArray(function (err, result) {
        if (err) {
            return callback(err)
        } else {
            if (result.length == 0)  {
                collection.insert({"word":word, "count" : 1}, function(err, result) {
                    if (err) {
                        return callback(err)
                    } else {
                        return callback(null, "success")
                    }
                });
            } else if (result.length == 1) {
                currentValue = result[0].count
                if (!isNaN(currentValue)) {
                    newValue = currentValue + 1
                    update(db, word, newValue, function(err, result) {
                        if (err) {
                            return callback(err)
                        } else {
                            return callback(null, "success")
                        }
                    });
                }
            }
        }
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
