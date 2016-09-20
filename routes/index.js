var express = require('express');
var router = express.Router();

var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport('smtps://geolytix%40gmail.com:123AppleTree@smtp.gmail.com');

router.get('/', function(req, res) {
  res.render('index');
});

router.get('/mobile', function(req, res) {
  res.render('mobile');
});

router.get('/map', function(req, res) {
  res.render('map');
});

router.get('/robots.txt', function(req, res) {
    res.type('text/plain');
    res.send('User-agent: *');
});

router.get('/contact', function (req, res) {

  var mailOptions = {
    from: 'geolytix@gmail.com',
    to: 'info@geolytix.co.uk',
    subject: 'mail from website',
    text: req.query.content
  };

  transporter.sendMail(mailOptions, function(error, info){
    if(error){
      return console.log(error);
    }
    console.log('Message sent: ' + info.response);
    res.json({ok:true});
  });

});

module.exports = router;
