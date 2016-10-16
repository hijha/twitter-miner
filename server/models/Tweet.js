var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var tweetSchema = new Schema({
    user : String;
    text : String;
    date : Date;
    id : Number;    
});

var Tweet = mongoose.model('Tweet', tweetSchema);

module.exports = Tweet;
