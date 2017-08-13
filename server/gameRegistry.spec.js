const gameRegistry = require('./gameRegistry');

describe('Game Registry', () => {
  beforeEach(() => {
    gameRegistry.removeAll();
  });

  it('should create an empty game with the given name', () => {
    const game = gameRegistry.createGame('My Game');
    expect(game.gameName).toBe('My Game');
    expect(game.cardsVisible).toBe(false);
    expect(game.players).toEqual([]);
    expect(game.votes).toEqual({});
  });

  it('should store the game keyed by its id', () => {
    const game = gameRegistry.createGame('My Game');
    expect(gameRegistry.getGame(game.gameId)).toBe(game);
  });

  it('should remove a game', () => {
    const game = gameRegistry.createGame('My Game');
    gameRegistry.removeGame(game.gameId);
    expect(gameRegistry.getGameCount()).toBe(0);
  });

  it('should provide the game count', () => {
    gameRegistry.createGame('My Game');
    gameRegistry.createGame('My Game 2');
    expect(gameRegistry.getGameCount()).toBe(2);
  });

  it('should remove all games', () => {
    gameRegistry.createGame('My Game');
    gameRegistry.createGame('My Game 2');
    gameRegistry.removeAll();
    expect(gameRegistry.getGameCount()).toBe(0);
  });
});
