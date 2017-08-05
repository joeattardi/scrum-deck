import * as Actions from '../actions';

type Action = Actions.All;

export function voteReducer(state = {}, action) {
  switch (action.type) {
    case Actions.VOTE:
      return Object.assign({}, state, { [action.payload.player]: action.payload.vote});
    case Actions.SET_GAME_STATE:
      return action.payload.votes;
    default:
      return state;
  }
}