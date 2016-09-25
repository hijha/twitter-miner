module.exports = function(app, database) {

    var twitterMiner = require('./../controllers/twitterMiner');

    app.get('/', function(req, res, next) {
        
    });

    app.post('/', function(req, res) {
        var handle = req.body.handle;
        var num = req.body.number;
        console.log(handle + " " + num);

        twitterMiner.readStopWords();
        twitterMiner.connect();

        twitterMiner.getTimeline(handle, num, function() {
            res.json(topWords);
        });
    });

};
