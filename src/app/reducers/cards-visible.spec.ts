import { HideCardsAction, SetGameStateAction, ShowCardsAction } from '../actions';
import { cardsVisibleReducer } from './cards-visible';

describe('Cards Visible reducer', () => {
  it('should show the cards regardless of current card visibility', () => {
    expect(cardsVisibleReducer(false, new ShowCardsAction())).toBe(true);
    expect(cardsVisibleReducer(true, new ShowCardsAction())).toBe(true);
  });

  it('should hide the cards regardless of current card visibility', () => {
    expect(cardsVisibleReducer(false, new HideCardsAction())).toBe(false);
    expect(cardsVisibleReducer(true, new HideCardsAction())).toBe(false);
  });

  it('should set the card visibility from the game state', () => {
    const state = {
      cardsVisible: true,
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
});