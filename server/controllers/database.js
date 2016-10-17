var exports = module.exports = {}

var mongoose = require('mongoose')
    Tweet = require('./../models/Tweet');

var url = 'mongodb://localhost:27017/myTestDB';

var userHandle;


exports.connectToDatabase = function (handle, callback) {
    userHandle = handle;
    mongoose.connect(url);
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'Unable to connect to database'));
    db.once('open', function() {
        console.log('Connection established to' , url);
        return callback(db)
    });
}

exports.addTweetToDatabase = function(handle, inputTweet) {
   var tweet = new Tweet({
        user : handle,
        text : inputTweet.text.toLowerCase(),
        date : inputTweet.created_at,
        id : inputTweet.id
    });
    tweet.save();
}

exports.findUserIfExists = function(handle, callback) {
    Tweet.findOne({user : handle}, function(err, tweet) {
        if (err) return callback(err);

        if (tweet == null) {
            console.log("returning null")
            return callback(null, null)
        } else {
            console.log("returning id " + tweet.id);
            return callback(null, tweet.id)
        }
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
