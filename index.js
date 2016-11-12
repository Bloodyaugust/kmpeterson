var compression = require('compression');
var express = require('express');
var fetch = require('node-fetch');
var assert = require('assert');
var bodyParser = require('body-parser');
var multer = require('multer');
var cloudinary = require('cloudinary');
var datauri = require('datauri');

var app = express();

var distMode = (process.argv[2] === 'dist');
var port = process.env.PORT || 8085;

var allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');

  next();
}

cloudinary.config({
  cloud_name: 'syntactic-sugar-studio',
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});

console.log(cloudinary.url('kmp', {format: 'json', type: 'list'}));

app.use(bodyParser.json());
app.use(allowCrossDomain);
app.use(compression());
if (distMode) {
  app.use(express.static('public'));
} else {
  app.use(express.static('app'));
}
app.use('/bower_components', express.static('bower_components'));

app.get('/images', function (req, res) {
  var start = parseInt(req.query.start) || 0,
    limit = parseInt(req.query.limit) || 10;

    fetch('http://res.cloudinary.com/syntactic-sugar-studio/image/list/kmp.json')
    .then(function (resp) {
      return resp.json();
    })
    .then(function (json) {
      res.json({
        code: 200,
        images: json.resources
      });
    })
    .catch(function (error) {
      res.json({
        code: 500,
        error: error
      });
    });
});

app.post('/images/upload', multer().single('space'), function (req, res) {
  var base64Image = new datauri();

  base64Image.format(req.file.originalname.split('.')[1], req.file.buffer);

  cloudinary.uploader.upload(base64Image.content, function (result) {
    if (result.secure_url) {
      dbConnection.collection('images').save({
        url: result.secure_url,
        created: new Date()
      });

      res.json({
        code: 200,
        message: 'Image upload successful'
      });
    } else {
      res.json({
        code: 500,
        message: 'Image upload failed'
      });
    }
  });
});

app.listen(port, function () {
  console.log('Listening on port ' + port + ' in ' + (distMode ? 'dist' : 'dev') + ' mode');
});
