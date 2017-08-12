export interface AppState {
  cardsVisible: boolean;
  gameId: string;
  gameName: string;
  playerId: string;
  playerName: string;
  players: Player[];
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
