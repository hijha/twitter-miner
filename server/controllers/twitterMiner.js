var exports = module.exports = {}

var Twitter = require ('twit');

var database = require('./database')
    fs = require('fs')
    path = require('path')
    twitter = require('./../config/TwitterConfig');

var myDB;
    stopWords = [];
    topWords = [];

exports.connect = function(handle) {
    database.connectToDatabase(handle, function(db) {
        myDB = db
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
    Add tweets to the array,
 */
exports.getTimeline = function (handle, num, date, callback) {
    twitter.get('statuses/user_timeline', {screen_name : handle, count : num}, function (err, data, response) {
        var tweets = [];
        tweetCount = 0;
        data.forEach(function(tweet) {
            tweetDate = Date.parse(tweet.created_at);
            tweetCount += 1;
            if (tweetCount <= num && tweetDate > date) {
                tweetText = tweet.text.toLowerCase();
                tweets.push(tweetText);
            }
        });
        parseUserTimeline(tweets, handle, callback);
    });
}

function parseUserTimeline (tweets, handle, callback) {
    var list = [];
    tweets.forEach(function(tweet) {
        console.log(tweet);
        words = parseTweet(tweet);
        
        words.forEach(function(word) {
            list.push(word);
        });
    });

    database.insert(myDB, list, function(err, result) {
        if (err) {
            console.log(err)
        } else {
            console.log("Succcessfully added %s to the database ", result.upsertedCount)
            retrieveData(myDB, handle, callback);
        }
    });
}

/*
    Function that parses the text into individual words (token) and
    adds to database.

    TODO:: result.upsertedcount only looks at inserts, not updates
*/
function parseTweet (tweet) {
    tokenizer = new natural.WordTokenizer();
    var tokenArray = tokenizer.tokenize(tweet)
    var newTokenArray = [];
    for (i = 0; i < tokenArray.length; i++) {
        if (stopWords.indexOf(tokenArray[i]) == -1) {
            newTokenArray.push(tokenArray[i])
        }
    }
    return newTokenArray;
}

retrieveData = function (db, handle, callback) {
    var collection = myDB.collection('dictionary');
    var cursor = collection.aggregate([
                                {$match : {"handle" : handle}},
                                {$sort : {count  : -1}}
                            ]);
    cursor.toArray(function(err, docs) {
        count = docs.length >= 10 ? 10 : docs.length;
        topWords = [];
        for (i = 0; i < count; i++) {
            topWords.push(docs[i].word);
        }
        return callback();
    });
}
