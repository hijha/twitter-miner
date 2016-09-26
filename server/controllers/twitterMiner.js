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

exports.connect = function(handle) {
    database.connectToDatabase(handle, function(db) {
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
        var list = [];
        data.forEach(function(tweet) {
            var tweetText = tweet.text.toLowerCase();
            console.log(tweetText);
            words = parseTweet(tweetText);
            
            words.forEach(function(word) {
                list.push(word);
            });
        });
        
        database.insert(myDB, list, function(err, result) {
            if (err) {
                console.log(err)
            } else {
                console.log("Succcessfully added %s to the database ", result.upsertedCount)
                retrieveData(myDB, callback);
            }
        });
        
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

retrieveData = function (db, callback) {
    console.log("....");
    var cursor = myDB.collection('dictionary').find().sort({count : -1});
    count = 0;
    topWords = [];
    cursor.each(function(err, doc) {
        console.log("testing");
        if (doc != null) {
            count++;
            topWords.push(doc.word);
            if (count == 10) {
                db.close();
                return (callback());
            } /*else if (!cursor.hasNext()._result) {
                console.log("here...");
                db.close();
                callback();  
            }*/
        }
    });
}
