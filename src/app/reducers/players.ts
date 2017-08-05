import * as Actions from '../actions';

type Action = Actions.All;

export function playersReducer(state: string[] = [], action: Action) {
  switch (action.type) {
    case Actions.PLAYER_JOINED:
      return [...state, action.payload];
    case Actions.PLAYER_LEFT:
      return state.filter(player => player !== action.payload);
    case Actions.PLAYER_LIST:
      return action.payload;
    case Actions.SET_GAME_STATE:
      return action.payload.players;
    default:
      return state;
  }
}
