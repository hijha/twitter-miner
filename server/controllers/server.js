var express = require('express');
    morgan = require('morgan');
    bodyParser = require('body-parser');
    natural = require('natural')

var hostname = 'localhost';
    port = 3000;

var app = express();

app.use(morgan('dev'));

app.use(bodyParser.json());

app.use(express.static(__dirname + '/../../public'));

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

var routes = require('./../routes')(app);

app.listen(port, hostname, function() {
    console.log('Server running');
});

