'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');

var cors = require('cors');

var app = express();

// Basic Configuration 
var port = process.env.PORT || 3000;

/** this project needs a db !! **/ 
mongoose.connect(process.env.MONGOLAB_URI);



app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here

var parser = require("body-parser");
app.use(parser.json());


app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});


var Url = require('./models/url');

// your first API endpoint... 
app.post("/api/shorturl/new", function (req, res) {
  console.log(req.params.url);
  res.json({"url": 'bla'});
});


app.listen(port, function () {
  console.log('Node.js listening ...');
});