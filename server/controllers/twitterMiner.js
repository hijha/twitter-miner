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

/**
 *  Return the list of users who have unfollowed since the last time
 *  the database was checked.
 *  If this is the first time for user, add to database only.
 */
exports.getUnfollowerList = function(handle, callback) {
    database.checkUserExists(handle, function(err, followersInDB) {

        if (followersInDB == null) {
            getCurrentFollowers(handle, function(followers) {
                addFollowersToDatabase(handle, followers, callback);
            });
        } else {
            getCurrentFollowers(handle, function(currentFollowers) {
                compareFollowersList(handle, followersInDB, currentFollowers, callback);
            });
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

/**
 *  Twitter rest api call to get a list of current followers
 */
function getCurrentFollowers(handle, callback) {
    var listOfFollowers = [];
    twitter.get('followers/list', {screen_name : handle}, function(err, followers, response) {
        followers.users.forEach(function(follower) {
            var f = new Object();
            f.username = follower.name;
            f.handle = follower.screen_name;
            listOfFollowers.push(f);
        });
        return callback(listOfFollowers);
    });
}

function addFollowersToDatabase(handle, followers, callback) {
    followers.forEach(function(follower) {
        database.addFollowerToDatabase(handle, follower);
    });
    return callback(mongooseConn, null);
}

function compareFollowersList(handle, followersInDB, currentFollowers, callback) {
    var currFollowerList = [];
    var unfollowedList = [];

    currentFollowers.forEach(function(currFoll) {
        currFollowerList.push(currFoll.handle);
    });

    //TODO:: These followers should also be deleted from the database
    followersInDB.forEach(function(follower) {
        if (currFollowerList.indexOf(follower.followerHandle) == -1) {
            unfollowedList.push(follower);
        }
    });

    currentFollowers.forEach(function(currFoll) {
        database.addFollowerToDatabase(handle, currFoll);
    });

    return callback(mongooseConn, unfollowedList);
}
