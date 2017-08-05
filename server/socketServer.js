const Server = require('socket.io');

const logger = require('./logger');

let io;

let players = [];

exports.init = function init(expressServer) {
  io = new Server(expressServer);

  io.on('connection', socket => {
    logger.info('New incoming socket connection');

    socket.on('join', name => {
      logger.info(`${name} is joining the game`);
      players.push({ name, socket });

      io.emit('playerList', players.map(record => record.name));
    });

    socket.on('disconnect', () => {
      const player = players.find(record => record.socket === socket);
      logger.info(`${player.name} disconnected`);

      players = players.filter(p => p !== player);
      io.emit('playerList', players.map(record => record.name));
    });
  });
};
