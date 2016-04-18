natural = require('natural')
database = require('./database')
Twitter = require ('twit')

var config = {
    "consumer_key": process.env.CONSUMER_KEY,
    "consumer_secret": process.env.CONSUMER_SECRET,
    "access_token": process.env.ACCESS_TOKEN,
    "access_token_secret": process.env.ACCESS_TOKEN_SECRET,
    "timeout_ms": ""
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
*/
var timelineSuccess = function (err, data, response) {
    var text = ""
    data.forEach(function(tweet) {
        parseTweet(tweet.text.toLowerCase())
    });
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
            console.log("Succcessfully added %s to the database ", result.upsertedCount)
        }
    });
};

connect()
twitter.get('statuses/user_timeline', {screen_name : 'jay_s_h', count : 3}, timelineSuccess)

function connect() {
    database.connectToDatabase(function(db) {
        myDB = db
    });
}
