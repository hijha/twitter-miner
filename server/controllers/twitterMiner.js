var exports = module.exports = {}

var Twitter = require ('twit');

var twitter = require('./../config/TwitterConfig');
    database = require('./database')
    unfollowModule = require('./unfollow')
    commonWordsModule = require('./commonWords');

exports.connect = function(handle) {
    database.connectToDatabase(handle, function(db) {
        mongooseConn = db
    });
}

exports.getCommonWords = function(handle, num, date, callback) {
    thresholdDate = new Date(date);

    commonWordsModule.getCommonWords(handle, thresholdDate, function(words) {
        commonWords = words.slice(0,num);
        callback(commonWords)
    });
}

exports.getUnfollowers = function(handle, callback) {
    unfollowModule.getUnfollowersList(handle, callback);
}
