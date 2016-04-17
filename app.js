natural = require('natural')
Twitter = require('twitter-node-client').Twitter;
database = require('./database')

var config = {
    "consumerKey": process.env.CONSUMER_KEY,
    "consumerSecret": process.env.CONSUMER_SECRET,
    "accessToken": process.env.ACCESS_TOKEN,
    "accessTokenSecret": process.env.ACCESS_TOKEN_SECRET,
    "callBackUrl": ""
}

var twitter = new Twitter(config);
var myDB

/*
    Callback function for error when retrieving user timeline
*/
var error = function (err, response, body) {
    console.log('ERROR [%s]', err);
};

/*
    The callback function when the timeline is successfully retrieved.
    Combines the tweet into one single space-separated string value,
    which is then parsed.

    TODO :: Instead of combining all the tweets, parse it individually?
*/
var timelineSuccess = function (data) {
    var text = ""
    res = JSON.parse(data);
    res.forEach(function(tweet) {
        if (text == "") {
            text = tweet.text
        } else {
            text = text + " " + tweet.text
        }
    });
    parseTweet(text)
};

/*
    Function that parses the text into individual words (token) and
    adds to database.
*/
function parseTweet(tweet) {
    tokenizer = new natural.WordTokenizer();
    var wordArray = tokenizer.tokenize(tweet)
    database.insert(myDB, wordArray, function(err, result) {
        if (err) {
            console.log(err)
        } else {
            console.log("succcess ", result.upsertedCount)
        }
    });
};

connect()
twitter.getUserTimeline({'screen_name' : "jay_s_h", 'count' : 2}, error, timelineSuccess);

function connect() {
    database.connectToDatabase(function(db) {
        myDB = db
    });
}
