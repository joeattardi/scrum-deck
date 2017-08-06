import * as Actions from '../actions';

type Action = Actions.All;

export function playerNameReducer(state = '', action: Action) {
  switch (action.type) {
    case Actions.SET_PLAYER_NAME:
      return action.payload;
    default:
      return state;
  }
}
