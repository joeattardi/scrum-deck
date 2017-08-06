import * as Actions from '../actions';

type Action = Actions.All;

export function cardsVisibleReducer(state = false, action: Action) {
  switch (action.type) {
    case Actions.SHOW_CARDS:
      return true;
    case Actions.HIDE_CARDS:
      return false;
    default:
      return state;
  }
}
