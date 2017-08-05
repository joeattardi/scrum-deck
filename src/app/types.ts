export interface AppState {
  players: string[];
  phase: string;
  votes: Votes;
}

export interface Vote {
  player: string;
  vote: string;
}

export interface Votes {
  [player: string]: string;
}
