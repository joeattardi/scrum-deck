import * as Actions from '../actions';

type Action = Actions.All;

export function phaseReducer(state = 'VOTING', action: Action) {
  switch (action.type) {
    case Actions.SET_GAME_STATE:
      return action.payload.phase;
    default:
      return state;
  }
}
