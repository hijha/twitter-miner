var exports = module.exports = {}

var mongoose = require('mongoose')
    Tweet = require('./../models/Tweet');
    Followers = require('./../models/Followers');

var url = 'mongodb://localhost:27017/myTestDB';

exports.connectToDatabase = function (handle, callback) {
    mongoose.connect(url);
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'Unable to connect to database'));
    db.once('open', function() {
        console.log('Connection established to' , url);
        return callback(db)
    });
}

exports.findUserIfExists = function(handle, callback) {
    Tweet.findOne({user : handle}, function(err, tweet) {
        if (err) return callback(err);

        if (tweet == null) {
            return callback(null, null)
        } else {
            return callback(null, tweet.id)
        }
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

/**
 *  Using find instead of findOne. findOne reads the document and returns it
 *  if it exists. find only returns a cursor and reads only if required.
 *  Since we only need to check if the user has been added or not, and don't
 *  need any extra information, find is better for performance.
 */
exports.checkUserExists = function(handle, callback) {
    Followers.find({user: handle}).exec(function(err, followersInDB) {
        if (err) return callback(err);

        if (followersInDB.length == 0) {
            return callback(null, null);
        } else {
            return callback(null, followersInDB);
        }
    });
}

exports.addFollowerToDatabase = function (handle, followerInfo) {
    var follower = new Followers({
        user : handle,
        followerName : followerInfo.username,
        followerHandle : followerInfo.handle
    });
    follower.save();
}
