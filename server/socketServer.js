const Server = require('socket.io');
const shortid = require('shortid');

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
      const playerId = shortid.generate();
      connectedPlayers.push({ id: playerId, name, socket });
      gameState.players.push({ id: playerId, name });

      socket.broadcast.emit('playerJoined', { id: playerId, name });
      socket.emit('playerId', playerId);
      socket.emit('gameState', gameState);
    });

    socket.on('disconnect', () => {
      const player = connectedPlayers.find(record => record.socket === socket);
      logger.info(`${player.name} disconnected`);

      connectdPlayers = connectedPlayers.filter(p => p !== player);
      gameState.players = gameState.players.filter(p => p.id !== player.id);
      delete gameState.votes[player.id];
      socket.broadcast.emit('playerLeft', { id: player.id, name: player.name });
    });

    socket.on('vote', vote => {
      const player = connectedPlayers.find(record => record.socket === socket);
      logger.info(`${player.name} voted ${vote}`);

      gameState.votes[player.id] = vote;
      socket.broadcast.emit('vote', { player: player.id, vote });
    });
  });
};
