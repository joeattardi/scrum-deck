import { Injectable } from '@angular/core';

import { AuthService } from './auth.service';

import * as io from 'socket.io-client';

@Injectable()
export class SocketService {
  private socket: SocketIOClient.Socket;

  playerList: string[];

  constructor(private authService: AuthService) { }

  init() {
    this.socket = io('/');

    this.socket.on('connect', () => {
      console.log('Connected to server');

      this.socket.emit('join', this.authService.name);
    });

    this.socket.on('playerList', players => {
      console.log('Player list:', players);
      this.playerList = players;
    });
  }
}
