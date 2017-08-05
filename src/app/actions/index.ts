import { Action } from '@ngrx/store';

export const PLAYER_JOINED = 'PLAYER_JOINED';
export const PLAYER_LEFT = 'PLAYER_LEFT';
export const PLAYER_LIST = 'PLAYER_LIST';

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

export type All = PlayerJoinedAction | PlayerLeftAction | PlayerListAction;
