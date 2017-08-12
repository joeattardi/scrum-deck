import * as Actions from '../actions';

type Action = Actions.All;

export function gameIdReducer(state = '', action: Action) {
  switch (action.type) {
    case Actions.SET_GAME_ID:
      return action.payload;
    case Actions.LEAVE_GAME:
      return null;
    default:
      return state;
  }
}
