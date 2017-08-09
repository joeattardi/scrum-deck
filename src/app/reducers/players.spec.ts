import { DummyAction, PlayerJoinedAction, PlayerLeftAction, SetGameStateAction } from '../actions';
import { playersReducer } from './players';

describe('Players reducer', () => {
  it('should default to an empty array', () => {
    expect(playersReducer(undefined, new DummyAction())).toEqual([]);
  });

  it('should add a player when they join', () => {
    const newState = playersReducer([], new PlayerJoinedAction({ id: 'abc123', name: 'Joe' }));
    expect(newState).toEqual([
      { id: 'abc123', name: 'Joe' }
    ]);
  });

  it('should keep the existing players when a player joins', () => {
    const initialState = [{ id: 'abc123', name: 'Joe' }];
    const newState = playersReducer(initialState, new PlayerJoinedAction({ id: 'def456', name: 'Bob' }));
    expect(newState).toEqual([
      { id: 'abc123', name: 'Joe' },
      { id: 'def456', name: 'Bob'}
    ]);
  });

  it('should remove a player when they leave', () => {
    const initialState = [{ id: 'abc123', name: 'Joe' }];
    const newState = playersReducer(initialState, new PlayerLeftAction({ id: 'abc123', name: 'Joe' }));
    expect(newState).toEqual([]);
  });

  it('should keep the other players when a player leaves', () => {
    const initialState = [
      { id: 'abc123', name: 'Joe' },
      { id: 'def456', name: 'Bob' }
    ];
    const newState = playersReducer(initialState, new PlayerLeftAction({ id: 'abc123', name: 'Joe' }));
    expect(newState).toEqual([{ id: 'def456', name: 'Bob' }]);
  });

  it('should replace the current players with the players from the game state', () => {
    const initialState = [
      { id: 'abc123', name: 'Joe' },
      { id: 'def456', name: 'Bob' }
    ];
    const newState = playersReducer(initialState, new SetGameStateAction({
      cardsVisible: true,
      playerId: 'adsf',
      playerName: 'Bill',
      players: [
        { id: 'adsf', name: 'Bill' },
        { id: 'zkfj', name: 'Sam' }
      ],
      phase: 'VOTING',
      votes: {}
    }));
    expect(newState).toEqual([
      { id: 'adsf', name: 'Bill' },
      { id: 'zkfj', name: 'Sam' }
    ]);
  });

  it('should leave the players unchanged on an unknown action', () => {
    const initialState = [{ id: 'abc123', name: 'Joe' }];
    expect(playersReducer(initialState, new DummyAction)).toEqual(initialState);
  });
});
