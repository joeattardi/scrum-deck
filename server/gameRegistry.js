const shortid = require('shortid');

let games = {};

exports.createGame = function createGame(gameName) {
  const gameState = {
    gameName,
    gameId: shortid.generate(),
    cardsVisible: false,
    players: [],
    votes: {},
    phase: 'VOTING'
  };

  games[gameState.gameId] = gameState;
  return gameState;
};

exports.getGame = function getGame(gameId) {
  return games[gameId];
};

exports.removeGame = function removeGame(gameId) {
  delete games[gameId];
};

exports.removeAll = function removeAll() {
  games = {};
};

exports.getGameCount = function getGameCount() {
  return Object.keys(games).length;
};
