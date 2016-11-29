module.exports = function(app) {

    var twitterMiner = require('./../controllers/twitterMiner');

    app.get('/topWords', function(req, res, next) {
        
    });

    app.post('/topWords', function(req, res) {
        var handle = req.body.handle;
        var num;
        var date;

        if (req.body.number == undefined || req.body.number > 10) {
            num = 10;
        } else {
            num = req.body.number;
        }

        if (req.body.startDate == undefined) {
            date = 0;
        } else {
            date = Date.parse(req.body.startDate);
        }

        console.log(handle + " " + num + " " + date);

        twitterMiner.readStopWords();
        twitterMiner.connect(handle);

        twitterMiner.getUserTimeline(handle, function(mongooseConn, topWords) {
            res.json(topWords);
            // TODO :: closing the connection here prevents database from being updated
            //mongooseConn.close();
        });
    });

    app.get('/unfollowed', function(req, res, next) {
 
    });

    app.post('/unfollowed', function(req, res) {
        var handle = req.body.handle;
        twitterMiner.connect(handle);

        twitterMiner.getUnfollowerList(handle, function(mongooseConn, unfollowers) {
            res.json(unfollowers);
            // TODO :: closing the connection here prevents database from being updated
            //mongooseConn.close();
        });
    });
};
