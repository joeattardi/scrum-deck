import * as Actions from '../actions';

type Action = Actions.All;

export function playerIdReducer(state = '', action: Action) {
  switch (action.type) {
    case Actions.SET_PLAYER_ID:
      return action.payload;
    default:
      return state;
  }
}
