const http = require('http');
const path = require('path');

const express = require('express');

const socketServer = require('./socketServer');

const app = express();

app.use(express.static(path.join(__dirname, '../dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

const port = process.env.PORT || 9000;

const server = http.createServer(app);
server.listen(port, () => console.log(`ScrumDeck listening on port ${port}`));

socketServer.init(server);
