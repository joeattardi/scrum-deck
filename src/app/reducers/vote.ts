import { omit } from 'lodash';

import * as Actions from '../actions';

type Action = Actions.All;

export function voteReducer(state = {}, action: Action) {
  switch (action.type) {
    case Actions.VOTE:
      return Object.assign({}, state, { [action.payload.player]: action.payload.vote});
    case Actions.SET_GAME_STATE:
      return action.payload.votes;
    case Actions.PLAYER_LEFT:
      return omit(state, action.payload.id);
    case Actions.NEW_GAME:
    case Actions.LEAVE_GAME:
      return {};
    default:
      return state;
  }
}
