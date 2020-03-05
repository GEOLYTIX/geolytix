const express = require('express');

const app = express();

app.use(process.env.DIR||'', express.static('public'));

app.get('/', (req, res) => require('./handler')(req, res));

app.listen(process.env.PORT || 3000);