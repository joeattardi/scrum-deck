import { DummyAction, LeaveGameAction, SetGameIdAction } from '../actions';
import { gameIdReducer } from './game-id';

describe('Game name reducer', () => {
  it('should default to an empty string', () => {
    expect(gameIdReducer(undefined, new DummyAction())).toBe('');
  });

  it('should set the game id', () => {
    expect(gameIdReducer('', new SetGameIdAction('abc123'))).toBe('abc123');
  });

  it('should leave the game id unchanged on an unknown action', () => {
    expect(gameIdReducer('abc123', new DummyAction())).toBe('abc123');
  });

  it('should clear the game id when leaving the game', () => {
    expect(gameIdReducer('abc123', new LeaveGameAction())).toBe(null);
  });
});
