var exports = module.exports = {}

var Twitter = require ('twit');

var database = require('./database')
    fs = require('fs')

var config = {
    "consumer_key": process.env.CONSUMER_KEY,
    "consumer_secret": process.env.CONSUMER_SECRET,
    "access_token": process.env.ACCESS_TOKEN,
    "access_token_secret": process.env.ACCESS_TOKEN_SECRET,
    "timeout_ms": ""
}

var myDB;
    stopWords = [];
    topWords = [];
    twitter = new Twitter(config);

exports.connect = function() {
    database.connectToDatabase(function(db) {
        myDB = db
    });
}

exports.readStopWords = function() {
    fs.readFile("stopwords.txt", function(err, output) {
        stopWords = output.toString().split("\n");
    });
}

exports.getTimeline = function (handle, num, callback) {
    twitter.get('statuses/user_timeline', {screen_name : handle, count : num}, function (err, data, response) {
        var text = ""
        data.forEach(function(tweet) {
            console.log(tweet.text.toLowerCase());
            parseTweet(tweet.text.toLowerCase())
        });
        retrieveData(myDB, callback);
    });
}

/*
    Function that parses the text into individual words (token) and
    adds to database.

    TODO:: result.upsertedcount only looks at inserts, not updates
*/
parseTweet = function (tweet) {
    tokenizer = new natural.WordTokenizer();
    var tokenArray = tokenizer.tokenize(tweet)
    var newTokenArray = []
    for (i = 0; i < tokenArray.length; i++) {
        if (stopWords.indexOf(tokenArray[i]) == -1) {
            newTokenArray.push(tokenArray[i])
        }
    }
    database.insert(myDB, handle, newTokenArray, function(err, result) {
        if (err) {
            console.log(err)
        } else {
            console.log("Succcessfully added %s to the database ", result.upsertedCount)
        }
    });
}

retrieveData = function (db, callback) {
    var cursor = db.collection('dictionary').find().sort({count : -1});
    count = 0;
    topWords = [];
    cursor.each(function(err, doc) {
        if (doc != null) {
            count++;
            topWords.push(doc.word);
            if (count == 10) {
                callback();
                return false;
            }
        }
    });
}
