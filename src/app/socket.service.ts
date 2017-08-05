import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as io from 'socket.io-client';

import { AppState } from './state';
import { AuthService } from './auth.service';
import { PlayerListAction } from './actions';

@Injectable()
export class SocketService {
  private socket: SocketIOClient.Socket;

  constructor(private authService: AuthService, private store: Store<AppState>) { }

  init() {
    this.socket = io('/');

    this.socket.on('connect', () => {
      this.socket.emit('join', this.authService.name);
    });

    this.socket.on('playerList', players => {
      this.store.dispatch(new PlayerListAction(players));
    });
  }
}
