var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var followersSchema = new Schema({
    user : String,
    followerName : String,
    followerHandle : String
});

followersSchema.index({user : 1, followerHandle : 1}, {unique: true});

var Followers = mongoose.model('Followers', followersSchema);

module.exports = Followers;
