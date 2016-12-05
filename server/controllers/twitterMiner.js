var exports = module.exports = {}

var Twitter = require ('twit');

var twitter = require('./../config/TwitterConfig');
    database = require('./database')
    unfollow = require('./unfollow')

var mongooseConn;
    stopWords = [];
    topWords = [];

exports.connect = function(handle) {
    database.connectToDatabase(handle, function(db) {
        mongooseConn = db
    });
}

exports.getUnfollowers = function(handle, callback) {
    unfollow.getUnfollowersList(handle, callback);
}
