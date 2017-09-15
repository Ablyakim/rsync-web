const express = require('express');
const app = express();
const ServiceContainer = require('./src/service-container');

const controllers = require('./src/controller');
const wsServer = require('./src/controller/ws');

const bodyParser = require('body-parser');

app.set('service-container', ServiceContainer);

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.set('view engine', 'pug');

controllers(app);
wsServer(app);

app.listen(3000,  () => {
  console.log('Example app listening on port 3000!');
});