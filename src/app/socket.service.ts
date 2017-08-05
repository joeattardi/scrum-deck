import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import debug from 'debug';
import * as io from 'socket.io-client';

import { AppState } from './types';
import { AuthService } from './auth.service';
import * as Actions from './actions';
import { Vote } from './types';

const logger = debug('ScrumDeck:SocketService');

@Injectable()
export class SocketService {
  private socket: SocketIOClient.Socket;

  constructor(private authService: AuthService, private store: Store<AppState>) { }

  init() {
    this.socket = io('/');

    this.socket.on('connect', () => {
      logger('Connected to socket server');
      this.socket.emit('join', this.authService.name);
    });

    this.socket.on('playerJoined', player => {
      logger(`Received: Player ${player} joined`);
      this.store.dispatch(new Actions.PlayerJoinedAction(player));
    });

    this.socket.on('playerLeft', player => {
      logger(`Received: Player ${player} left`);
      this.store.dispatch(new Actions.PlayerLeftAction(player));
    });

    this.socket.on('gameState', state => {
      logger('Got game state:', state);
      this.store.dispatch(new Actions.SetGameStateAction(state));
    });

    this.socket.on('playerId', playerId => {
      this.authService.playerId = playerId;
    });

    this.socket.on('vote', (vote: Vote) => {
      logger(`Received: ${vote.player} voted ${vote.vote}`);
      this.store.dispatch(new Actions.VoteAction(vote));
    });
  }

  castVote(vote) {
    logger(`Sending vote for ${this.authService.name}: ${vote}`);
    this.socket.emit('vote', vote);
  }
}
