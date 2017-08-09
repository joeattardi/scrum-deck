import { DummyAction, SetPlayerIdAction } from '../actions';
import { playerIdReducer } from './player-id';

describe('Player ID reducer', () => {
  it('should default to an empty string', () => {
    expect(playerIdReducer(undefined, new DummyAction())).toBe('');
  });

  it('should set the player id', () => {
    expect(playerIdReducer('', new SetPlayerIdAction('abc123'))).toBe('abc123');
  });

  it('should leave the player id unchanged on an unknown action', () => {
    expect(playerIdReducer('abc123', new DummyAction())).toBe('abc123');
  });
});
