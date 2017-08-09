import { Action } from '@ngrx/store';
import { AppState, Player, Vote } from '../types';

export const HIDE_CARDS = 'HIDE_CARDS';
export const NEW_GAME = 'NEW_GAME';
export const PLAYER_JOINED = 'PLAYER_JOINED';
export const PLAYER_LEFT = 'PLAYER_LEFT';
export const SET_GAME_STATE = 'SET_GAME_STATE';
export const SET_PLAYER_ID = 'SET_PLAYER_ID';
export const SET_PLAYER_NAME = 'SET_PLAYER_NAME';
export const SHOW_CARDS = 'SHOW_CARDS';
export const VOTE = 'VOTE';

export class HideCardsAction implements Action {
  readonly type = HIDE_CARDS;
}

export class NewGameAction implements Action {
  readonly type = NEW_GAME;
}

export class SetPlayerIdAction implements Action {
  readonly type = SET_PLAYER_ID;
  constructor(public payload: string) { }
}

export class SetPlayerNameAction implements Action {
  readonly type = SET_PLAYER_NAME;
  constructor(public payload: string) { }
}

export class PlayerJoinedAction implements Action {
  readonly type = PLAYER_JOINED;
  constructor(public payload: Player) { }
}

export class PlayerLeftAction implements Action {
  readonly type = PLAYER_LEFT;
  constructor(public payload: Player) { }
}

export class SetGameStateAction implements Action {
  readonly type = SET_GAME_STATE;
  constructor(public payload: AppState) { }
}

export class ShowCardsAction implements Action {
  readonly type = SHOW_CARDS;
}

export class VoteAction implements Action {
  readonly type = VOTE;
  constructor(public payload: Vote) { }
}

export class DummyAction implements Action {
  readonly type = 'DUMMY';
}

export type All = PlayerJoinedAction
  | HideCardsAction
  | NewGameAction
  | SetPlayerIdAction
  | SetPlayerNameAction
  | PlayerLeftAction
  | SetGameStateAction
  | ShowCardsAction
  | VoteAction
  | DummyAction;
