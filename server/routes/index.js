module.exports = function(app, database) {

    var twitterMiner = require('./../controllers/twitterMiner');

    app.get('/', function(req, res, next) {
        
    });

    app.post('/', function(req, res) {
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

        twitterMiner.getTimeline(handle, num, date, function() {
            res.json(topWords);
        });
    });
};
