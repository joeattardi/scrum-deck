import { Action } from '@ngrx/store';
import { AppState, Vote } from '../types';

export const PLAYER_JOINED = 'PLAYER_JOINED';
export const PLAYER_LEFT = 'PLAYER_LEFT';
export const PLAYER_LIST = 'PLAYER_LIST';
export const SET_GAME_STATE = 'SET_GAME_STATE';
export const VOTE = 'VOTE';

export class PlayerJoinedAction implements Action {
  readonly type = PLAYER_JOINED;
  constructor(public payload: string) { }
}

export class PlayerLeftAction implements Action {
  readonly type = PLAYER_LEFT;
  constructor(public payload: string) { }
}

export class PlayerListAction implements Action {
  readonly type = PLAYER_LIST;
  constructor(public payload: string[]) { }
}

export class SetGameStateAction implements Action {
  readonly type = SET_GAME_STATE;
  constructor(public payload: AppState) { }
}

export class VoteAction implements Action {
  readonly type = VOTE;
  constructor(public payload: Vote) { }
}

export type All = PlayerJoinedAction
  | PlayerLeftAction
  | PlayerListAction
  | SetGameStateAction
  | VoteAction;
