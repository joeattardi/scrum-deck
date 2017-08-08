import * as Actions from '../actions';

type Action = Actions.All;

export function playerIdReducer(state = '', action: Action) {
  switch (action.type) {
    case Actions.SET_PLAYER_ID:
      console.log('setting player id');
      return action.payload;
    default:
      return state;
  }
}
