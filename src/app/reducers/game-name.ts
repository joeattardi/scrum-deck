import * as Actions from '../actions';

type Action = Actions.All;

export function gameNameReducer(state = '', action: Action) {
  switch (action.type) {
    case Actions.SET_GAME_NAME:
      return action.payload;
    case Actions.SET_GAME_STATE:
      return action.payload.gameName;
    case Actions.LEAVE_GAME:
      return null;
    default:
      return state;
  }
}
