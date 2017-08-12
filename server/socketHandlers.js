const { pick } = require('lodash');
const shortid = require('shortid');

const gameRegistry = require('./gameRegistry');
const logger = require('./logger');
const playerRegistry = require('./playerRegistry');
const socketConstants = require('../shared/socketConstants');

function logGameState(gameState) {
  logger.debug(`(${gameState.gameName}) Game state: ${JSON.stringify(gameState)}`);
}

exports.handleJoin = function handleJoin(socket, data, callback) {
  logger.debug(`(socket) Received ${socketConstants.JOIN}, data: ${JSON.stringify(data)}`);
  const gameState = gameRegistry.getGame(data.gameId);

  if (gameState) {
    logger.info(`Player "${data.name}" is joining game "${gameState.gameName}"`);

    const playerId = shortid.generate();
    logger.debug(`Generated player ID for "${data.name}": ${playerId}`);

    playerRegistry.addPlayer(playerId, data.name, data.gameId, socket);
    playerRegistry.logPlayers();
    
    gameState.players.push({ id: playerId, name: data.name });

    socket.join(gameState.gameId);

    logger.debug(`(${gameState.gameName}) Hiding cards`);
    gameState.cardsVisible = false;
    logger.debug(`(socket) Sending ${socketConstants.HIDE_CARDS} to ${data.gameId}`);
    socket.to(data.gameId).emit(socketConstants.HIDE_CARDS);

    logGameState(gameState);

    socket.to(data.gameId).emit(socketConstants.PLAYER_JOINED, { id: playerId, name: data.name });
    socket.emit(socketConstants.PLAYER_ID, playerId);
    socket.emit(socketConstants.GAME_STATE, gameState);
    callback(socketConstants.OK);
  } else {
    logger.debug(`Game ${data.gameId} not found`);
    callback(socketConstants.GAME_NOT_FOUND);
  }
};

exports.handleCreateGame = function handleCreateGame(socket, gameName) {
  const gameState = gameRegistry.createGame(gameName);
  logger.info(`New game created: "${gameName}" with id ${gameState.gameId}`);
  logger.debug(`${gameRegistry.getGameCount()} active games`);
  logger.debug(`(socket) Sending ${socketConstants.GAME_ID}: ${gameState.gameId}`);
  socket.emit(socketConstants.GAME_ID, gameState.gameId);
};

exports.handleDisconnect = function handleDisconnect(socket) {
  const player = playerRegistry.getPlayer(socket);
  if (player) {
    logger.info(`${player.name} disconnected`);

    logger.debug(`Removing player "${player.name}" from player registry`);
    const gameState = gameRegistry.getGame(player.gameId);
    playerRegistry.removePlayer(player);
    playerRegistry.logPlayers();

    logger.debug(`Removing player "${player.name}" from game "${gameState.gameName}"`);
    gameState.players = gameState.players.filter(p => p.id !== player.id);
    delete gameState.votes[player.id];
    logGameState(gameState);

    const messageData = { id: player.id, name: player.name };
    logger.debug(`(socket) Sending ${socketConstants.PLAYER_LEFT}, ${JSON.stringify(messageData)} to ${player.gameId}`);
    socket.to(player.gameId).emit(socketConstants.PLAYER_LEFT, messageData);

    if (gameState.players.length === 0) {
      logger.debug(`No more players in game "${gameState.gameName}", removing game`);
      gameRegistry.removeGame(gameState.gameId);
      logger.debug(`${gameRegistry.getGameCount()} active games`);
    }
  }
};

exports.handleVote = function handleVote(io, socket, voteData) {
  logger.debug(`(socket) Received ${socketConstants.VOTE}, voteData:`, voteData);
  
  const player = playerRegistry.getPlayer(socket);
  const gameState = gameRegistry.getGame(voteData.gameId);
  logger.debug(`(${gameState.gameName}) Player "${player.name}" voted ${voteData.vote}`);

  gameState.votes[player.id] = voteData.vote;
  socket.to(gameState.gameId).emit(socketConstants.VOTE, {
    player: {
      id: player.id,
      name: player.name
    }, vote: voteData.vote });

  if (Object.keys(gameState.votes).length === gameState.players.length) {
    logger.debug(`(${gameState.gameName}) All players have voted`);
    gameState.cardsVisible = true;
    logger.debug(`(socket) Sending ${socketConstants.SHOW_CARDS} to ${gameState.gameId}`);
    io.to(gameState.gameId).emit(socketConstants.SHOW_CARDS);
  }
};

exports.handleNewGame = function handleNewGame(io, socket, gameId) {
  logger.debug(`(socket) Received ${socketConstants.NEW_GAME}, ${gameId}`);
  
  const player = playerRegistry.getPlayer(socket);
  const gameState = gameRegistry.getGame(gameId);
  logger.info(`(${gameState.gameName}) Player "${player.name}" started a new round`);

  gameState.votes = {};
  gameState.cardsVisible = false;
  logGameState(gameState);

  logger.debug(`(socket) Sending ${socketConstants.NEW_GAME} to ${gameId}`);
  socket.to(gameId).emit(socketConstants.NEW_GAME);

  logger.debug(`(socket) Sending ${socketConstants.HIDE_CARDS} to ${gameId}`);
  io.in(gameId).emit(socketConstants.HIDE_CARDS);
};