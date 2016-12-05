var exports = module.exports = {}

var fs = require('fs');
    path = require('path');
    twitter = require('./../config/TwitterConfig'); 
    database = require('./database')
    stopWords = [];
    topWords = [];

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
