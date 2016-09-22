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

var topWords = [];

var app = express();

app.use(morgan('dev'));

app.use(bodyParser.json());

app.use(express.static(__dirname + '/../public'));

app.get('/', function(req, res, next) {
    console.log("req header is : " + req.header);
});


app.post('/', function(req, res) {
    var handle = req.body.handle;
    var num = req.body.number;
    console.log(handle + " " + num);
    readStopWords();
    connect();
    getTimeline(handle, num, function() {
        res.json(topWords);
    });
});

function getTimeline(handle, num, callback) {
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
        console.log(tweet.text.toLowerCase());
        parseTweet(tweet.text.toLowerCase())
    });
    retrieveData(myDB, callback);
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

function retrieveData(db, callback) {
    var cursor = db.collection('dictionary').find().sort({count : -1});
    count = 0;
    topWords = [];
    cursor.each(function(err, doc) {
        if (doc != null) {
            count++;
            topWords.push(doc.word);
            if (count == 10) {
                console.log("count = " +  count);
                callback();
                return false;
            }
        }
    });
};

app.listen(port, hostname, function() {
    console.log('Server running');
});

