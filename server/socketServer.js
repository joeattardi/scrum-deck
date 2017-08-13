const Server = require('socket.io');

const socketConstants = require('../shared/socketConstants');
const socketHandlers = require('./socketHandlers');
const logger = require('./logger');

exports.init = function init(expressServer) {
  const io = new Server(expressServer);

  io.on(socketConstants.CONNECTION, (socket) => {
    logger.debug('(socket) New incoming socket connection');

    socket.on(socketConstants.JOIN, (data, callback) =>
      socketHandlers.handleJoin(socket, data, callback));
    socket.on(socketConstants.CREATE_GAME, (gameName, callback) =>
      socketHandlers.handleCreateGame(socket, gameName, callback));
    socket.on(socketConstants.DISCONNECT, () => socketHandlers.handleDisconnect(socket));
    socket.on(socketConstants.VOTE, voteData => socketHandlers.handleVote(io, socket, voteData));
    socket.on(socketConstants.NEW_GAME, gameId => socketHandlers.handleNewGame(io, socket, gameId));
  });
};
