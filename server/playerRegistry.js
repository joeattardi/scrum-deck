const { pick } = require('lodash');
const logger = require('./logger');

let connectedPlayers = [];

exports.addPlayer = function addPlayer(id, name, gameId, socket) {
  connectedPlayers.push({ id, name, gameId, socket });
};

exports.removePlayer = function removePlayer(player) {
  connectedPlayers = connectedPlayers.filter(p => p !== player);
}

exports.logPlayers = function logPlayers() {
  if (logger.level === 'debug') {
    logger.debug(`Connected players: `, connectedPlayers.map(record => pick(record, ['id', 'name', 'gameId'])));
  }
};

exports.getPlayerCount = function getPlayerCount() {
  return connectedPlayers.length;
}

exports.getPlayer = function getPlayer(socket) {
  return connectedPlayers.find(record => record.socket === socket);
};

exports.removeAll = function removeAll() {
  connectedPlayers = [];
}