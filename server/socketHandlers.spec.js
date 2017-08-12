const shortid = require('shortid');

const gameRegistry = require('./gameRegistry');
const logger = require('./logger');
const playerRegistry = require('./playerRegistry');
const socketConstants = require('../shared/socketConstants');
const socketHandlers = require('./socketHandlers');

logger.level = 'error';

describe('Socket Handlers', () => {
  beforeEach(() => {
    gameRegistry.removeAll();
    playerRegistry.removeAll();
  });

  it('should create a game', () => {
    spyOn(shortid, 'generate').and.returnValue('abc123');
    spyOn(gameRegistry, 'createGame').and.callThrough();
    const socket = jasmine.createSpyObj('socket', ['emit']);
    socketHandlers.handleCreateGame(socket, 'My Game');

    expect(gameRegistry.createGame).toHaveBeenCalledWith('My Game');
    expect(socket.emit).toHaveBeenCalledWith(socketConstants.GAME_ID, 'abc123');
  });

  it('should handle a player joining a game', () => {
    const game = gameRegistry.createGame('My Game');
    const gameId = game.gameId;

    spyOn(playerRegistry, 'addPlayer').and.callThrough();
    spyOn(shortid, 'generate').and.returnValue('abc123');

    const gameEmit = jasmine.createSpy();
    const socket = {
      join: jasmine.createSpy(),
      emit: jasmine.createSpy(),
      to: () => ({ emit: gameEmit })
    };
    spyOn(socket, 'to').and.callThrough();

    const callback = jasmine.createSpy();

    const joinData = { gameId, name: 'Joe' };
    socketHandlers.handleJoin(socket, joinData, callback);

    expect(playerRegistry.addPlayer).toHaveBeenCalledWith('abc123', 'Joe', gameId, socket);
    expect(game.players).toEqual([{ id: 'abc123', name: 'Joe' }]);
    expect(socket.join).toHaveBeenCalledWith(gameId);
    expect(game.cardsVisible).toBe(false);
    expect(socket.to).toHaveBeenCalledWith(gameId);
    expect(gameEmit).toHaveBeenCalledWith(socketConstants.HIDE_CARDS);
    expect(gameEmit).toHaveBeenCalledWith(socketConstants.PLAYER_JOINED, { id: 'abc123', name: 'Joe' });
    expect(socket.emit).toHaveBeenCalledWith(socketConstants.PLAYER_ID, 'abc123');
    expect(socket.emit).toHaveBeenCalledWith(socketConstants.GAME_STATE, game);
    expect(callback).toHaveBeenCalledWith(socketConstants.OK);
  });

  it('should send an error when joining a game id that does not exist', () => {
    const game = gameRegistry.createGame('My Game');
    const gameId = game.gameId;

    spyOn(playerRegistry, 'addPlayer').and.callThrough();
    spyOn(shortid, 'generate').and.returnValue('abc123');

    const gameEmit = jasmine.createSpy();
    const socket = {
      join: jasmine.createSpy(),
      emit: jasmine.createSpy(),
      to: () => ({ emit: gameEmit })
    };
    spyOn(socket, 'to').and.callThrough();

    const callback = jasmine.createSpy();

    const joinData = { gameId: 'invalidGameId', name: 'Joe' };
    socketHandlers.handleJoin(socket, joinData, callback);
    expect(callback).toHaveBeenCalledWith(socketConstants.GAME_NOT_FOUND);
  });

  it('should handle a player disconnecting', () => {
    const game = gameRegistry.createGame('My Game');
    const gameId = game.gameId;
    game.players = [
      { id: 'zxc456', name: 'Bob' }
    ];
    game.votes = {
      zxc456: '5'
    };

    const gameEmit = jasmine.createSpy();
    const socket = {
      to: () => ({ emit: gameEmit })
    };
    spyOn(socket, 'to').and.callThrough();

    playerRegistry.addPlayer('abc123', 'Joe', gameId, socket);
    spyOn(playerRegistry, 'removePlayer').and.callThrough();

    socketHandlers.handleDisconnect(socket);

    expect(playerRegistry.removePlayer).toHaveBeenCalledWith({ id: 'abc123', name: 'Joe', gameId, socket });
    expect(game.players).toEqual([
      { id: 'zxc456', name: 'Bob' }
    ]);
    expect(game.votes).toEqual({
      zxc456: '5'
    });
    expect(socket.to).toHaveBeenCalledWith(gameId);
    expect(gameEmit).toHaveBeenCalledWith(socketConstants.PLAYER_LEFT, { id: 'abc123', name: 'Joe' });
  });

  it('should remove the game if the last player disconnects', () => {
    const game = gameRegistry.createGame('My Game');
    const gameId = game.gameId;

    const gameEmit = jasmine.createSpy();
    const socket = {
      to: () => ({ emit: gameEmit })
    };
    spyOn(socket, 'to').and.callThrough();

    playerRegistry.addPlayer('abc123', 'Joe', gameId, socket);
    spyOn(playerRegistry, 'removePlayer').and.callThrough();
    spyOn(gameRegistry, 'removeGame').and.callThrough();

    socketHandlers.handleDisconnect(socket);
    expect(gameRegistry.removeGame).toHaveBeenCalledWith(gameId);
    expect(gameRegistry.getGameCount()).toBe(0);
  });

  it('should not remove the game if a player disconnects and there are more players remaining', () => {
    const game = gameRegistry.createGame('My Game');
    const gameId = game.gameId;
    game.players = [
      { id: 'zxc456', name: 'Bob' }
    ];

    const gameEmit = jasmine.createSpy();
    const socket = {
      to: () => ({ emit: gameEmit })
    };
    spyOn(socket, 'to').and.callThrough();

    playerRegistry.addPlayer('abc123', 'Joe', gameId, socket);
    spyOn(playerRegistry, 'removePlayer').and.callThrough();
    spyOn(gameRegistry, 'removeGame').and.callThrough();

    socketHandlers.handleDisconnect(socket);
    expect(gameRegistry.removeGame).not.toHaveBeenCalled();
    expect(gameRegistry.getGameCount()).toBe(1);
  });

  it('should handle a vote and should not show the cards if not all players have voted', () => {
    const game = gameRegistry.createGame('My Game');
    const gameId = game.gameId;

    const ioEmit = jasmine.createSpy();
    const io = {
      to: () => ({ emit: ioEmit })
    };
    spyOn(io, 'to').and.callThrough();

    const socketEmit = jasmine.createSpy();
    const socket = {
      to: () => ({ emit: socketEmit })
    };
    spyOn(socket, 'to').and.callThrough();

    playerRegistry.addPlayer('abc123', 'Joe', gameId, socket);
    game.players = [{ id: 'abc123', name: 'Joe' }, { id: 'zxc456', name: 'Bob' }];
    socketHandlers.handleVote(io, socket, { gameId, vote: '5' });

    expect(game.votes).toEqual({ abc123: '5' });
    expect(socket.to).toHaveBeenCalledWith(gameId);
    expect(socketEmit).toHaveBeenCalledWith(socketConstants.VOTE, {
      player: { id: 'abc123', name: 'Joe' },
      vote: '5'
    });
    expect(io.to).not.toHaveBeenCalled();
    expect(game.cardsVisible).toBe(false);
  });

  it('should show the cards if all players have voted', () => {
    const game = gameRegistry.createGame('My Game');
    const gameId = game.gameId;

    const ioEmit = jasmine.createSpy();
    const io = {
      to: () => ({ emit: ioEmit })
    };
    spyOn(io, 'to').and.callThrough();

    const socketEmit = jasmine.createSpy();
    const socket = {
      to: () => ({ emit: socketEmit })
    };
    spyOn(socket, 'to').and.callThrough();

    playerRegistry.addPlayer('abc123', 'Joe', gameId, socket);
    game.players = [{ id: 'abc123', name: 'Joe' }];
    socketHandlers.handleVote(io, socket, { gameId, vote: '5' });

    expect(game.votes).toEqual({ abc123: '5' });
    expect(socket.to).toHaveBeenCalledWith(gameId);
    expect(socketEmit).toHaveBeenCalledWith(socketConstants.VOTE, {
      player: { id: 'abc123', name: 'Joe' },
      vote: '5'
    });
    expect(io.to).toHaveBeenCalled();
    expect(ioEmit).toHaveBeenCalledWith(socketConstants.SHOW_CARDS);
    expect(game.cardsVisible).toBe(true);
  });

  it('should handle a new game', () => {
    const game = gameRegistry.createGame('My Game');
    const gameId = game.gameId;

    const ioEmit = jasmine.createSpy();
    const io = {
      in: () => ({ emit: ioEmit })
    };
    spyOn(io, 'in').and.callThrough();

    const socketEmit = jasmine.createSpy();
    const socket = {
      to: () => ({ emit: socketEmit })
    };
    spyOn(socket, 'to').and.callThrough();

    playerRegistry.addPlayer('abc123', 'Joe', gameId, socket);
    game.players = [{ id: 'abc123', name: 'Joe' }];
    game.votes = { abc123: '5' };
    game.cardsVisible = true;

    socketHandlers.handleNewGame(io, socket, gameId);
    expect(game.votes).toEqual({});
    expect(game.cardsVisible).toBe(false);

    expect(socket.to).toHaveBeenCalledWith(gameId);
    expect(socketEmit).toHaveBeenCalledWith(socketConstants.NEW_GAME);

    expect(io.in).toHaveBeenCalledWith(gameId);
    expect(ioEmit).toHaveBeenCalledWith(socketConstants.HIDE_CARDS);
  });
});