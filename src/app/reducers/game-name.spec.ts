import { DummyAction, LeaveGameAction, SetGameNameAction, SetGameStateAction } from '../actions';
import { gameNameReducer } from './game-name';

describe('Game name reducer', () => {
  it('should default to an empty string', () => {
    expect(gameNameReducer(undefined, new DummyAction())).toBe('');
  });

  it('should set the game name', () => {
    expect(gameNameReducer('', new SetGameNameAction('abc123'))).toBe('abc123');
  });

  it('should set the game name from the game state', () => {
    const gameName = gameNameReducer('', new SetGameStateAction({
      cardsVisible: true,
      gameId: 'zxcv',
      gameName: 'My Game',
      playerId: 'asdf',
      playerName: 'Joe',
      players: [],
      phase: 'VOTING',
      votes: {}
    }));
    expect(gameName).toBe('My Game');
  });

  it('should leave the game name unchanged on an unknown action', () => {
    expect(gameNameReducer('abc123', new DummyAction())).toBe('abc123');
  });

  it('should clear the game name when leaving the game', () => {
    expect(gameNameReducer('abc123', new LeaveGameAction())).toBe(null);
  });
});
