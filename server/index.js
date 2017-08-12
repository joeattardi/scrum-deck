const http = require('http');
const path = require('path');

const express = require('express');

const pkg = require('../package.json');
const socketServer = require('./socketServer');
const logger = require('./logger');

const app = express();

app.use(express.static(path.join(__dirname, '../dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

const port = process.env.PORT || 9000;

console.log('##############################################################');
console.log(`ScrumDeck ${pkg.version}`)
console.log('Copyright (c) 2017 Joe Attardi');
console.log('Licensed under the terms of the MIT License');
console.log('##############################################################');

logger.debug(`Base URL: ${process.env.BASE_URL}`);

const server = http.createServer(app);
server.listen(port, () => logger.info(`Server listening on port ${port}`));

socketServer.init(server);
