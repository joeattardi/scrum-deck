import * as Actions from '../actions';
import { Player } from '../types';

type Action = Actions.All;

export function playersReducer(state: Player[] = [], action: Action) {
  switch (action.type) {
    case Actions.PLAYER_JOINED:
      return [...state, action.payload];
    case Actions.PLAYER_LEFT:
      return state.filter(player => player.id !== action.payload.id);
    case Actions.SET_GAME_STATE:
      return action.payload.players;
    default:
      return state;
  }
}
