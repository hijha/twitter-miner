var express = require('express');
    morgan = require('morgan');
    bodyParser = require('body-parser');
    natural = require('natural')

var hostname = 'localhost';
    port = 3000;

var app = express();

app.use(morgan('dev'));

app.use(bodyParser.json());

app.use(express.static(__dirname + '/../../public'));

var routes = require('./../routes')(app);

app.listen(port, hostname, function() {
    console.log('Server running');
});

