import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import debug from 'debug';
import * as io from 'socket.io-client';

import * as Actions from './actions';
import * as socketConstants from '../../shared/socketConstants';
import { AppState } from './types';
import { AuthService } from './auth.service';
import { Vote } from './types';

const logger = debug('ScrumDeck:SocketService');

@Injectable()
export class SocketService {
  private socket: SocketIOClient.Socket;

  constructor(private authService: AuthService, private store: Store<AppState>) { }

  init() {
    this.socket = io('/');

    this.socket.on(socketConstants.CONNECT, () => {
      logger('Connected to socket server');
      this.socket.emit(socketConstants.JOIN, this.authService.name);
    });

    this.socket.on(socketConstants.PLAYER_ID, playerId => {
      logger(`Got my player id: ${playerId}`)
      this.store.dispatch(new Actions.SetPlayerIdAction(playerId));
    });

    this.socket.on(socketConstants.PLAYER_JOINED, player => {
      logger(`Received: Player ${player} joined`);
      this.store.dispatch(new Actions.PlayerJoinedAction(player));
    });

    this.socket.on(socketConstants.PLAYER_LEFT, player => {
      logger(`Received: Player ${player} left`);
      this.store.dispatch(new Actions.PlayerLeftAction(player));
    });

    this.socket.on(socketConstants.GAME_STATE, state => {
      logger('Got game state:', state);
      this.store.dispatch(new Actions.SetGameStateAction(state));
    });

    this.socket.on(socketConstants.VOTE, (vote: Vote) => {
      logger(`Received: ${vote.player} voted ${vote.vote}`);
      this.store.dispatch(new Actions.VoteAction(vote));
    });

    this.socket.on(socketConstants.NEW_GAME, () => {
      logger(`Received signal for new game`);
      this.store.dispatch(new Actions.NewGameAction());
    });

    this.socket.on(socketConstants.SHOW_CARDS, () => {
      logger('Received signal to show cards');
      this.store.dispatch(new Actions.ShowCardsAction());
    });

    this.socket.on(socketConstants.HIDE_CARDS, () => {
      logger('Received signal to hide cards');
      this.store.dispatch(new Actions.HideCardsAction());
    });
  }

  castVote(vote) {
    logger(`Sending vote for ${this.authService.name}: ${vote}`);
    this.socket.emit(socketConstants.VOTE, vote);
  }

  playAgain() {
    logger('Sending request for new game');
    this.socket.emit(socketConstants.NEW_GAME);
  }

  showCards() {
    logger('Sending signal to show cards');
    this.socket.emit('showCards');
  }

  hideCards() {
    logger('Sending signal to hide cards');
    this.socket.emit('hideCards');
  }
}
