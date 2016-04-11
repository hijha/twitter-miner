database = require('./database')

database.connectToDatabase(function(db) {
    db.collections(function (err, collections) {
        console.log(collections[0].collectionName)
        db.close();
    });
});
