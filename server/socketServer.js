const Server = require('socket.io');
const shortid = require('shortid');

const socketConstants = require('../shared/socketConstants');
const logger = require('./logger');

let io;

let connectedPlayers = [];

let gameState = {
  players: [],
  phase: 'VOTING',
  cardsVisible: false,
  votes: {}
};

function getPlayer(socket) {
  return connectedPlayers.find(record => record.socket === socket);
}

exports.init = function init(expressServer) {
  io = new Server(expressServer);

  io.on(socketConstants.CONNECTION, socket => {
    logger.info('New incoming socket connection');

    socket.on(socketConstants.JOIN, name => {
      logger.info(`${name} is joining the game`);
      const playerId = shortid.generate();
      connectedPlayers.push({ id: playerId, name, socket });
      gameState.players.push({ id: playerId, name });

      gameState.cardsVisible = false;
      io.emit(socketConstants.HIDE_CARDS);

      socket.broadcast.emit(socketConstants.PLAYER_JOINED, { id: playerId, name });
      socket.emit(socketConstants.PLAYER_ID, playerId);
      socket.emit(socketConstants.GAME_STATE, gameState);
    });

    socket.on(socketConstants.DISCONNECT, () => {
      const player = getPlayer(socket);
      logger.info(`${player.name} disconnected`);

      connectedPlayers = connectedPlayers.filter(p => p !== player);
      gameState.players = gameState.players.filter(p => p.id !== player.id);
      delete gameState.votes[player.id];
      socket.broadcast.emit(socketConstants.PLAYER_LEFT, { id: player.id, name: player.name });
    });

    socket.on(socketConstants.VOTE, vote => {
      const player = getPlayer(socket);
      logger.info(`${player.name} voted ${vote}`);

      gameState.votes[player.id] = vote;
      socket.broadcast.emit(socketConstants.VOTE, {
        player: {
          id: player.id,
          name: player.name
        }, vote });

      if (Object.keys(gameState.votes).length === gameState.players.length) {
        logger.info('All players have voted');
        gameState.cardsVisible = true;
        io.emit(socketConstants.SHOW_CARDS);
      }
    });

    socket.on(socketConstants.NEW_GAME, () => {
      const player = getPlayer(socket);
      logger.info(`${player.name} started a new game`);

      gameState.votes = {};
      gameState.cardsVisible = false;
      socket.broadcast.emit(socketConstants.NEW_GAME);
      io.emit(socketConstants.HIDE_CARDS);
    });

    socket.on(socketConstants.SHOW_CARDS, () => {
      const player = getPlayer(socket);
      logger.info(`${player.name} showed the cards`);
      gameState.cardsVisible = true;

      socket.broadcast.emit(socketConstants.SHOW_CARDS);
    });

    socket.on(socketConstants.HIDE_CARDS, () => {
      const player = getPlayer(socket);
      logger.info(`${player.name} hid the cards`);
      gameState.cardsVisible = false;

      socket.broadcast.emit(socketConstants.HIDE_CARDS);
    });
  });
};
