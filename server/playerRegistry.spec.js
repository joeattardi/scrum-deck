const playerRegistry = require('./playerRegistry');

describe('Player Registry', () => {
  beforeEach(() => {
    playerRegistry.removeAll();
  });

  it('should add a player', () => {
    const socket = {};
    playerRegistry.addPlayer('abc123', 'Joe', 'zxc456', socket);
    expect(playerRegistry.getPlayerCount()).toBe(1);

    const player = playerRegistry.getPlayer(socket);
    expect(player.id).toBe('abc123');
  });

  it('should remove a player', () => {
    const socket = {};
    playerRegistry.addPlayer('abc123', 'Joe', 'zxc456', socket);
    const player = playerRegistry.getPlayer(socket);
    playerRegistry.removePlayer(player);
    expect(playerRegistry.getPlayerCount()).toBe(0);
  });

  it('should remove all players', () => {
    playerRegistry.addPlayer('abc123', 'Joe', 'zxc456', {});
    expect(playerRegistry.getPlayerCount()).toBe(1);
    playerRegistry.removeAll();
    expect(playerRegistry.getPlayerCount()).toBe(0);
  });

  it('should get the player count', () => {
    playerRegistry.addPlayer('abc123', 'Joe', 'zxc456', {});
    playerRegistry.addPlayer('def456', 'Bob', 'asd984', {});
    expect(playerRegistry.getPlayerCount()).toBe(2);
  });
});