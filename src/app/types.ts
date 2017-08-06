export interface AppState {
  cardsVisible: boolean;
  playerId: string;
  playerName: string;
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

export interface Player {
  id: string;
  name: string;
}
