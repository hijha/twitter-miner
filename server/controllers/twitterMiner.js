var exports = module.exports = {}

var Twitter = require ('twit');

var database = require('./database')
    fs = require('fs')
    path = require('path')
    twitter = require('./../config/TwitterConfig');

var mongooseConn;
    stopWords = [];
    topWords = [];

exports.connect = function(handle) {
    database.connectToDatabase(handle, function(db) {
        mongooseConn = db
    });
}

exports.readStopWords = function() {
    global.approot = path.resolve(__dirname);
    stopwordsFilepath = approot + '/stopwords.txt';
    fs.readFile(stopwordsFilepath, function(err, output) {
        stopWords = output.toString().split("\n");
    });
}

/**
    Check if user already exists in database
 */
exports.getUserTimeline = function(handle, callback) {
    database.findUserIfExists(handle, function (err, lastId) {
        if (lastId == null) {
            getNewTimeline(handle, callback)
        } else {
            updateTimeline(handle, callback, lastId)
        }
    });
}

exports.getUnfollowerList = function(handle, callback) {
    database.checkUserExists(handle, function(err, followers) {
        if (followers == null) {
            getListOfFollowers(handle, callback);
        } else {
            console.log("followers length = " + followers.length);
        }
    });
}
/**
    Get the timeline for the user that does not exist in the database
 */
function getNewTimeline(handle, callback) {
    twitter.get('statuses/user_timeline', {screen_name : handle, count : 100}, function (err, timeline, response) {
        timeline.forEach(function(tweet) {
            database.addTweetToDatabase(handle, tweet);
        });
        return callback(mongooseConn, topWords);
    });
}

/**
    Update the timeline for the user that does already exists in the database
 */
function updateTimeline(handle, callback, lastId) {
    twitter.get('statuses/user_timeline', {screen_name : handle, count : 100, since_id : lastId}, function (err, timeline, response) {
        timeline.forEach(function(tweet) {
            database.addTweetToDatabase(handle, tweet);
        });
        return callback(mongooseConn, topWords);
    });
}

function getListOfFollowers(handle, callback) {
    twitter.get('followers/list', {screen_name : handle}, function(err, followers, response) {
        followers.users.forEach(function(follower) {
            database.addFollowerToDatabase(handle, follower);
        });
        return callback(mongooseConn, followers.users);
    });
}
