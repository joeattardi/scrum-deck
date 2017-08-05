const Server = require('socket.io');

const logger = require('./logger');

let io;

let connectedPlayers = [];

let gameState = {
  players: [],
  phase: 'VOTING',
  votes: {}
};

exports.init = function init(expressServer) {
  io = new Server(expressServer);

  io.on('connection', socket => {
    logger.info('New incoming socket connection');

    socket.on('join', name => {
      logger.info(`${name} is joining the game`);
      connectedPlayers.push({ name, socket });
      gameState.players.push(name);

      socket.broadcast.emit('playerJoined', name);
      socket.emit('gameState', gameState);
    });

    socket.on('disconnect', () => {
      const player = connectedPlayers.find(record => record.socket === socket);
      logger.info(`${player.name} disconnected`);

      connectdPlayers = connectedPlayers.filter(p => p !== player);
      gameState.players = gameState.players.filter(p => p !== player.name);
      socket.broadcast.emit('playerLeft', player.name);
    });

    socket.on('vote', vote => {
      const player = connectedPlayers.find(record => record.socket === socket);
      logger.info(`${player.name} voted ${vote}`);

      gameState.votes[player.name] = vote;
      socket.broadcast.emit('vote', { player: player.name, vote });
    });
  });
};
