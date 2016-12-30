module.exports = function(app) {

    var twitterMiner = require('./../controllers/twitterMiner');

    app.get('/topWords', function(req, res, next) {
        
    });

    app.post('/topWords', function(req, res) {
        var handle = req.body.handle;
        var num = req.body.number;
        var date = req.body.date;

        console.log(handle + " " + num + " " + date);

        twitterMiner.connect(handle);
        twitterMiner.getCommonWords(handle, num, date, function(topWords) {
            res.json(topWords);
        });
    });

    app.get('/unfollowed', function(req, res, next) {
 
    });

    app.post('/unfollowed', function(req, res) {
        var handle = req.body.handle;
        twitterMiner.connect(handle);

        twitterMiner.getUnfollowers(handle, function(mongooseConn, unfollowers) {
            if (unfollowers == null) {
                res.json({"unfollowers" : [], "firstLogin" : true})
            } else if (unfollowers.length == 0) {
                res.json({"unfollowers" : [], "firstLogin" : false})
            } else {
                res.json({"unfollowers" : unfollowers});
            }

            // TODO :: closing the connection here prevents database from being updated
            //mongooseConn.close();
        });
    });
};
