import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import debug from 'debug';
import * as io from 'socket.io-client';
import { NotificationsService } from 'angular2-notifications';

import * as Actions from './actions';
import * as socketConstants from '../../shared/socketConstants';
import { AppState } from './types';
import { AuthService } from './auth.service';
import { Vote } from './types';

const logger = debug('ScrumDeck:SocketService');

@Injectable()
export class SocketService {
  private socket: SocketIOClient.Socket;

  constructor(private authService: AuthService, private store: Store<AppState>,
    private notificationsService: NotificationsService) { }

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
      logger(`Received: Player ${player.name} joined`);
      this.notificationsService.info('Player Joined', `${player.name} joined the game`);
      this.store.dispatch(new Actions.PlayerJoinedAction(player));
    });

    this.socket.on(socketConstants.PLAYER_LEFT, player => {
      logger(`Received: Player ${player.name} left`);
      this.notificationsService.info('Player Left', `${player.name} left the game`);
      this.store.dispatch(new Actions.PlayerLeftAction(player));
    });

    this.socket.on(socketConstants.GAME_STATE, state => {
      logger('Got game state:', state);
      this.store.dispatch(new Actions.SetGameStateAction(state));
    });

    this.socket.on(socketConstants.VOTE, vote => {
      logger(`Received: ${vote.player.name} voted ${vote.vote}`);
      this.notificationsService.info('Player Voted', `${vote.player.name} voted`);
      this.store.dispatch(new Actions.VoteAction({
        player: vote.player.id,
        vote: vote.vote
      }));
    });

    this.socket.on(socketConstants.NEW_GAME, () => {
      logger(`Received signal for new game`);
      this.notificationsService.info('New Game', 'Starting a new game');
      this.store.dispatch(new Actions.NewGameAction());
    });

    this.socket.on(socketConstants.SHOW_CARDS, () => {
      logger('Received signal to show cards');
      this.notificationsService.info('Voting Complete', 'All players have voted');
      this.store.dispatch(new Actions.ShowCardsAction());
    });

    this.socket.on(socketConstants.HIDE_CARDS, () => {
      logger('Received signal to hide cards');
      this.store.dispatch(new Actions.HideCardsAction());
    });
  }

  castVote(vote) {
    logger(`Sending vote for ${this.authService.name}: ${vote}`);
    this.notificationsService.success('Vote Cast', `You voted ${vote}`);
    this.socket.emit(socketConstants.VOTE, vote);
  }

  newGame() {
    logger('Sending request for new game');
    this.notificationsService.info('New Game', 'Starting a new game');
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
