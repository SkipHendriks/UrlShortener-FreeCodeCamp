'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var dns = require('dns');

var cors = require('cors');

var app = express();

// Basic Configuration 
var port = process.env.PORT || 3000;

/** this project needs a db !! **/ 
mongoose.connect(process.env.MONGOLAB_URI, { useNewUrlParser: true }).catch(function (err) {
    console.log('Unable to connect to the mongodb instance. Error: ', err);
});;



app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here

var parser = require("body-parser");
app.use(parser.json());


app.use('/public', express.static(process.cwd() + '/public'));

app.use(parser.urlencoded({
  extended: true
}));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});


var Url = require('./models/url');

// your first API endpoint... 
app.post("/api/shorturl/new", function (req, res) {
  dns.lookup(req.body.url,(err) => {
    console.log(err);
    if (err) {
      res.status(400).json({error: "invalid URL"});
    } else {
      let url = new Url({url: req.body.url, short_url: generateUniqueNum()});
      url.save((err) => {
        if (err) {
          res.status(500).json({error: "serverError"})
        }
        res.json({url: url.url, short_url: url.short_url});
      });
    }
  });
});


app.listen(port, function () {
  console.log('Node.js listening ...');
});

  
function generateNum() {
    return Math.floor(Math.random() * (9999 - 1000) + 1000);
}

function generateUniqueNum() {
    var num = generateNum();
    Url.findOne({short_url: num}, function(err, data) {
        if (err) console.log(err);
        if (data){
            num = generateUniqueNum();
        }
    });
    return num;
}