var exports = module.exports = {}

var database = require('./database')
    twitter = require('./../config/TwitterConfig');

/**
 *  Return the list of users who have unfollowed since the last time
 *  the database was checked.
 *  If this is the first time for user, add to database only.
 */
exports.getUnfollowersList = function(handle, callback) {
    database.checkUserFollowerListExists(handle, function(err, followersInDB) {
        if (followersInDB == null) {
            getCurrentFollowers(handle, function(newFollowers) {
                addFollowersToDatabase(handle, newFollowers, callback);
            });
        } else {
            getCurrentFollowers(handle, function(currentFollowers) {
                compareFollowersList(handle, followersInDB, currentFollowers, callback);
            });
        }
    });
}

/**
 *  Twitter rest api call to get a list of current followers
 */
function getCurrentFollowers(handle, callback) {
    var listOfCurrentFollowers = [];
    twitter.get('followers/list', {screen_name : handle}, function(err, followers, response) {
        followers.users.forEach(function(follower) {
            var f = new Object();
            f.username = follower.name;
            f.handle = follower.screen_name;
            listOfCurrentFollowers.push(f);
        });
        return callback(listOfCurrentFollowers);
    });
}

function addFollowersToDatabase(handle, followers, callback) {
    followers.forEach(function(follower) {
        database.addFollower(handle, follower);
    });
    return callback(null, null);
}

function compareFollowersList(handle, followersInDB, currentFollowers, callback) {
    var currentFollowerUserHandles = [];
    var unfollowers = [];

    currentFollowers.forEach(function(currFoll) {
        currentFollowerUserHandles.push(currFoll.handle);
    });

    followersInDB.forEach(function(follower) {
        if (currentFollowerUserHandles.indexOf(follower.followerHandle) == -1) {
            unfollowers.push(follower);
            database.deleteFollower(handle, follower.followerHandle);
        }
    });

    currentFollowers.forEach(function(currFoll) {
        database.addFollower(handle, currFoll);
    });
    return callback(null, unfollowers);
}
