const port = process.env.PORT || 3000;
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(require('helmet').noCache());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use('/', express.static(path.join(__dirname, 'public')));
app.use('/', require('./router'));

app.listen(port);
console.log('The magic happens on port ' + port);