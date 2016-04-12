database = require('./database')

database.connectToDatabase(function(db) {
    database.insert(db,"node", function(err, result) {
        if (err) {
            console.log(err)
        } else if (result == "success") {
            console.log("Word successfully added to database")
        } else {
            console.log("result %s", result)
        }
    });
});
