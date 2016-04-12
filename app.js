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

var error = function (err, response, body) {
    //console.log('ERROR [%s]', err);
};

var timelineSuccess = function (data) {
    var text = ""
    res = JSON.parse(data);
    res.forEach(function(tweet) {
//        parseTweet(tweet.text);
        if (text == "") {
            text = tweet.text
        } else {
            text = text + " " + tweet.text
        }
    });
    parseTweet(text)
};

function parseTweet(tweet) {
    tokenizer = new natural.WordTokenizer();
    var wordArray = tokenizer.tokenize(tweet)
    wordArray.forEach(function(word) {
        database.insert(myDB, word, function(err, result) {
            if (err) {
                console.log(err)
            } else if (result == "success") {
                console.log("Word successfully added to database")
            } else {
                console.log("result %s", result)
            }
        });
    });
};

connect()
twitter.getUserTimeline({'screen_name' : "jay_s_h", 'count' : 2}, error, timelineSuccess);


function connect() {
    database.connectToDatabase(function(db) {
        myDB = db
    });
}
/*
database.insert(db,"node", function(err, result) {
    if (err) {
        console.log(err)
    } else if (result == "success") {
        console.log("Word successfully added to database")
    } else {
        console.log("result %s", result)
    }
});
*/
