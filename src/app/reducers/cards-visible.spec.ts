import { DummyAction, HideCardsAction, LeaveGameAction, SetGameStateAction, ShowCardsAction } from '../actions';
import { cardsVisibleReducer } from './cards-visible';

describe('Cards Visible reducer', () => {
  it('should default to false', () => {
    expect(cardsVisibleReducer(undefined, new DummyAction())).toBe(false);
  });

  it('should show the cards regardless of current card visibility', () => {
    expect(cardsVisibleReducer(false, new ShowCardsAction())).toBe(true);
    expect(cardsVisibleReducer(true, new ShowCardsAction())).toBe(true);
  });

  it('should hide the cards regardless of current card visibility', () => {
    expect(cardsVisibleReducer(false, new HideCardsAction())).toBe(false);
    expect(cardsVisibleReducer(true, new HideCardsAction())).toBe(false);
  });

  it('should hide the cards when leaving the game', () => {
    expect(cardsVisibleReducer(true, new LeaveGameAction())).toBe(false);
  });

  it('should set the card visibility from the game state', () => {
    const state = {
      cardsVisible: true,
      gameId: 'asdf',
      gameName: 'My Game',
      playerId: 'abc123',
      playerName: 'Joe',
      players: [],
      phase: 'VOTING',
      votes: {}
    };
    expect(cardsVisibleReducer(false, new SetGameStateAction(state))).toBe(true);
    expect(cardsVisibleReducer(true, new SetGameStateAction(state))).toBe(true);

    state.cardsVisible = false;
    expect(cardsVisibleReducer(false, new SetGameStateAction(state))).toBe(false);
    expect(cardsVisibleReducer(true, new SetGameStateAction(state))).toBe(false);
  });

  it('should leave the state unchanged on an unknown action', () => {
    expect(cardsVisibleReducer(false, new DummyAction())).toBe(false);
    expect(cardsVisibleReducer(true, new DummyAction())).toBe(true);
  });
});
