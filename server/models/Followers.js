var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var followersSchema = new Schema({
    user : String,
    followerName : String,
    followerHandle : String
});

var Followers = mongoose.model('Followers', followersSchema);

module.exports = Followers;
