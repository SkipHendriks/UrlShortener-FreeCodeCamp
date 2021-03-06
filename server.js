'use strict';

const express = require('express');

const mongo = require('mongodb');
const mongoose = require('mongoose');

const Url = require('./models/url'); // mongoose model

const dns = require('dns'); // to resolve hostname and partialy verify url corectness
const URL = require('url').URL; // native node url parser

const cors = require('cors');

const app = express();

// Basic Configuration 
const port = process.env.PORT || 3000;

/** this project needs a db !! **/ 
mongoose.connect(process.env.MONGOLAB_URI, { useNewUrlParser: true }).catch(function (err) {
    console.log('Unable to connect to the mongodb instance. Error: ', err);
});;

app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here

const parser = require("body-parser");
app.use(parser.json());


app.use('/public', express.static(process.cwd() + '/public'));

app.use(parser.urlencoded({
  extended: true
}));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});


// [POST] endpoint for new urls 
app.post("/api/shorturl/new", function (req, res) {
  const hostname = new URL(req.body.url).hostname;
  dns.lookup(hostname, (err) => {
    if (err) {
      res.status(400).json({error: "invalid URL"});
    } else {
      let url = new Url({url: req.body.url, short_url: generateUniqueNum()});
      url.save((err) => {
        if (err) {
          res.status(500).json({error: err});
        }
        res.json({url: url.url, short_url: url.short_url});
      });
    }
  });
});

// [GET] endpoint for accesing saved urls
app.get("/api/shorturl/:num", function (req, res) {
  Url.findOne({ 'short_url': req.params.num }, 'url', function (err, url) {
    if (err) {
      res.status(500).json({error: err})
    } else if (url) {
      res.redirect(301, url.url);
    } else {
      res.status(400).json({error: "No short url found for given input"});
    }
  });
});


app.listen(port, function () {
  console.log('Node.js listening ...');
});

  
function generateNum() {
    return Math.floor(Math.random() * (9999 - 1001) + 1001);
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