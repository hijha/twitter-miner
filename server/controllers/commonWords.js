var exports = module.exports = {}

var fs = require('fs');
    path = require('path');
    twitter = require('./../config/TwitterConfig'); 
    database = require('./database')
    stopWords = [];

exports.getCommonWords = function(handle, thresholdDate, callback) {
    readStopWords();
    getTweets(handle, thresholdDate, function(tweets) {
        getMostCommonWords(tweets, callback);
    });
}

function readStopWords() {
    global.approot = path.resolve(__dirname);
    stopwordsFilepath = approot + '/stopwords.txt';
    fs.readFile(stopwordsFilepath, function(err, output) {
        stopWords = output.toString().split("\n");
    });
}

function getTweets (handle, thresholdDate, callback) {
    tweetCollection = []

    twitter.get('statuses/user_timeline', {screen_name : handle, count : 200}, function (err, timeline, response) {
        timeline.every(function(tweet) {
            var tweetDate = new Date(tweet.created_at);
            var isTweetInRange = tweetDate > thresholdDate
            if (isTweetInRange) {
                tweetCollection.push(tweet)
            }
            return isTweetInRange
        })
        callback(tweetCollection)
    });
}

function getMostCommonWords (tweets, callback) {
    tweetDictionary = {};
    tweets.forEach(function(tweet) {
        words = parseTweet(tweet.text);
        for (i =0; i < words.length; i++) {
            if (!(words[i] in tweetDictionary))  {
                tweetDictionary[words[i]] = 1;
            } else {
                wordCount = tweetDictionary[words[i]]
                tweetDictionary[words[i]] = wordCount + 1;
            }
        }
    });
    var wordMap = [];
    for (var word in tweetDictionary) {
        wordMap.push([word, tweetDictionary[word]]);
    }

    wordMap.sort(function(a, b) {
        return b[1] -  a[1]
    });

    var tweetWords = [];
    for (i = 0; i < wordMap.length; i++) {
        tweetWords.push(wordMap[i][0]);
    }

    callback(tweetWords)
}

function parseTweet(tweetText) {
    tweetText = tweetText.toLowerCase();
    tokenizer = new natural.WordTokenizer();

    var tokenArray = tokenizer.tokenize(tweetText)
    var tweetWords = []
    for (i = 0; i < tokenArray.length; i++) {
        if (stopWords.indexOf(tokenArray[i]) == -1) {
            tweetWords.push(tokenArray[i])
        }
    }
    return tweetWords;
}
