database = require('./database')

/*
    A basic implementation of how the database will be read
*/
database.connectToDatabase(function(db) {
    database.getCommonWords(db, 6, function(err, result) {
        console.log(result)
        db.close()
    });
});
