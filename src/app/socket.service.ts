import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import debug from 'debug';
import * as io from 'socket.io-client';
import { NotificationsService } from 'angular2-notifications';

import * as Actions from './actions';
import * as socketConstants from '../../shared/socketConstants';
import { AppState } from './types';
import { Vote } from './types';

const logger = debug('ScrumDeck:SocketService');

@Injectable()
export class SocketService {
  private socket: SocketIOClient.Socket;
  private playerName: string;

  constructor(private store: Store<AppState>, private notificationsService: NotificationsService) {
    store.select((state: AppState) => state.playerName)
      .subscribe((playerName: string) => {
        this.playerName = playerName;
      });
   }

  init() {
    this.setSocket(io('/'));

    this.socket.on(socketConstants.CONNECT, () => this.handleConnection(this.socket));
    this.socket.on(socketConstants.PLAYER_ID, playerId => this.handlePlayerId(playerId));
    this.socket.on(socketConstants.PLAYER_JOINED, player => this.handlePlayerJoined(player));
    this.socket.on(socketConstants.PLAYER_LEFT, player => this.handlePlayerLeft(player));
    this.socket.on(socketConstants.GAME_STATE, state => this.handleGameState(state));
    this.socket.on(socketConstants.VOTE, vote => this.handleVote(vote));
    this.socket.on(socketConstants.NEW_GAME, () => this.handleNewGame());
    this.socket.on(socketConstants.SHOW_CARDS, () => this.handleShowCards());
    this.socket.on(socketConstants.HIDE_CARDS, () => this.handleHideCards());
  }

  setSocket(socket: SocketIOClient.Socket) {
    this.socket = socket;
  }

  handleConnection(socket) {
    logger('Connected to socket server');
    socket.emit(socketConstants.JOIN, this.playerName);
  }

  handlePlayerId(playerId) {
    logger(`Got my player id: ${playerId}`);
    this.store.dispatch(new Actions.SetPlayerIdAction(playerId));
  }

  handlePlayerJoined(player) {
    logger(`Received: Player ${player.name} joined`);
    this.notificationsService.info('Player Joined', `${player.name} joined the game`);
    this.store.dispatch(new Actions.PlayerJoinedAction(player));
  }

  handlePlayerLeft(player) {
    logger(`Received: Player ${player.name} left`);
    this.notificationsService.info('Player Left', `${player.name} left the game`);
    this.store.dispatch(new Actions.PlayerLeftAction(player));
  }

  handleGameState(state) {
    logger('Got game state:', state);
    this.store.dispatch(new Actions.SetGameStateAction(state));
  }

  handleVote(vote) {
    logger(`Received: ${vote.player.name} voted ${vote.vote}`);
    this.notificationsService.info('Player Voted', `${vote.player.name} voted`);
    this.store.dispatch(new Actions.VoteAction({
      player: vote.player.id,
      vote: vote.vote
    }));
  }

  handleNewGame() {
    logger(`Received signal for new game`);
    this.notificationsService.info('New Game', 'Starting a new game');
    this.store.dispatch(new Actions.NewGameAction());
  }

  handleShowCards() {
    logger('Received signal to show cards');
    this.notificationsService.info('Voting Complete', 'All players have voted');
    this.store.dispatch(new Actions.ShowCardsAction());
  }

  handleHideCards() {
    logger('Received signal to hide cards');
    this.store.dispatch(new Actions.HideCardsAction());
  }

  castVote(vote) {
    logger(`Sending vote for ${this.playerName}: ${vote}`);
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
    this.socket.emit(socketConstants.SHOW_CARDS);
  }

  hideCards() {
    logger('Sending signal to hide cards');
    this.socket.emit(socketConstants.HIDE_CARDS);
  }
}
