import { DummyAction, LeaveGameAction, NewGameAction, PlayerLeftAction, SetGameStateAction, VoteAction } from '../actions';
import { voteReducer } from './vote';

describe('Vote reducer', () => {
  it('should default to an empty object', () => {
    expect(voteReducer(undefined, new DummyAction())).toEqual({});
  });

  it('should record a new vote', () => {
    const startVotes = {
      abc123: '5'
    };
    const newVotes = voteReducer(startVotes, new VoteAction({ player: 'def456', vote: '8' }));
    expect(newVotes).toEqual({
      abc123: '5',
      def456: '8'
    });
  });

  it('should set the votes from the new game state', () => {
    const startVotes = {
      abc123: '5'
    };
    const newVotes = voteReducer(startVotes, new SetGameStateAction({
      cardsVisible: true,
      gameId: 'lkgj',
      gameName: 'My Game',
      playerId: 'adsf',
      playerName: 'Bill',
      players: [
        { id: 'adsf', name: 'Bill' },
        { id: 'zkfj', name: 'Sam' }
      ],
      phase: 'VOTING',
      votes: {
        adsf: '8',
        zkfj: '8'
      }
    }));
    expect(newVotes).toEqual({
      adsf: '8',
      zkfj: '8'
    });
  });

  it('should remove a player\'s vote when they leave the game', () => {
    const startVotes = {
      abc123: '5',
      def456: '8'
    };
    Object.freeze(startVotes);
    const newVotes = voteReducer(startVotes, new PlayerLeftAction({ id: 'def456', name: 'Bob' }));
    expect(newVotes).toEqual({
      abc123: '5'
    });
  });

  it('should reset the votes when a new game begins', () => {
    const startVotes = {
      abc123: '5'
    };
    const newVotes = voteReducer(startVotes, new NewGameAction());
    expect(newVotes).toEqual({});
  });

  it('should leave the votes unchanged on an unknown action', () => {
    const startVotes = {
      abc123: '5',
      def456: '8'
    };
    expect(voteReducer(startVotes, new DummyAction())).toEqual(startVotes);
  });

  it('should clear the votes when leaving the game', () => {
    const startVotes = {
      abc123: '5'
    };
    expect(voteReducer(startVotes, new LeaveGameAction())).toEqual({});
  });
});
