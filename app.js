database = require('./database')

database.connectToDatabase(function(db) {
    database.insert(db,"world");
});
