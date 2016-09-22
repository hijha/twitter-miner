var express = require('express');
    morgan = require('morgan');
    bodyParser = require('body-parser');
    natural = require('natural')
    Twitter = require ('twit')

var database = require('./database')
    fs = require('fs')

var config = {
    "consumer_key": process.env.CONSUMER_KEY,
    "consumer_secret": process.env.CONSUMER_SECRET,
    "access_token": process.env.ACCESS_TOKEN,
    "access_token_secret": process.env.ACCESS_TOKEN_SECRET,
    "timeout_ms": ""
}

var twitter = new Twitter(config);
var myDB;
var stopWords = [];
    hostname = 'localhost';
    port = 3000;


var app = express();

app.use(morgan('dev'));

app.use(bodyParser.json());

app.use(express.static(__dirname + '/../public'));

app.get('/', function(req, res, next) {
    console.log("req header is : " + req.header);
});


app.post('/', function(req, res) {
    console.log("test");
    res.json("testing...");
});

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

    TODO:: result.upsertedcount only looks at inserts, not updates
*/
function parseTweet(tweet) {
    tokenizer = new natural.WordTokenizer();
    var tokenArray = tokenizer.tokenize(tweet)
    var newTokenArray = []
    for (i = 0; i < tokenArray.length; i++) {
        if (stopWords.indexOf(tokenArray[i]) == -1) {
            newTokenArray.push(tokenArray[i])
        }
    }
    database.insert(myDB, newTokenArray, function(err, result) {
        if (err) {
            console.log(err)
        } else {
            console.log("Succcessfully added %s to the database ", result.upsertedCount)
        }
    });
};

//readStopWords()
//connect()
//twitter.get('statuses/user_timeline', {screen_name : 'jay_s_h', count : 100}, timelineSuccess)

function connect() {
    database.connectToDatabase(function(db) {
        myDB = db
    });
}

function readStopWords() {
    fs.readFile("stopwords.txt", function(err, output) {
        stopWords = output.toString().split("\n");
    });
}

app.listen(port, hostname, function() {
    console.log('Server running');
});

