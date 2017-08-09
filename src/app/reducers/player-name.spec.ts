import { SetPlayerNameAction } from '../actions';
import { playerNameReducer } from './player-name';

describe('Player Name reducer', () => {
  it('should set the player name', () => {
    expect(playerNameReducer('', new SetPlayerNameAction('Joe'))).toBe('Joe');
  });
});
