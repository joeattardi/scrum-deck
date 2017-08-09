import { SetPlayerIdAction } from '../actions';
import { playerIdReducer } from './player-id';

describe('Player ID reducer', () => {
  it('should set the player id', () => {
    expect(playerIdReducer('', new SetPlayerIdAction('abc123'))).toBe('abc123');
  });
});
