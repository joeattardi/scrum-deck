import { DummyAction, LeaveGameAction, SetPlayerNameAction } from '../actions';
import { playerNameReducer } from './player-name';

describe('Player Name reducer', () => {
  it('should default to an empty string', () => {
    expect(playerNameReducer(undefined, new DummyAction())).toBe('');
  });

  it('should set the player name', () => {
    expect(playerNameReducer('', new SetPlayerNameAction('Joe'))).toBe('Joe');
  });

  it('should leave the player name unchanged on an unknown action', () => {
    expect(playerNameReducer('Joe', new DummyAction())).toBe('Joe');
  });

  it('should clear the player name when leaving the game', () => {
    expect(playerNameReducer('Joe', new LeaveGameAction())).toBe(null);
  });
});
