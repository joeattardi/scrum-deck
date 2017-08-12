import { CanDeactivate } from '@angular/router';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { AppState } from './types';
import { GameComponent } from './game/game.component';
import { LeaveGameAction } from './actions';
import { SocketService } from './socket.service';

@Injectable()
export class LeaveGameGuard implements CanDeactivate<GameComponent> {
  private gameName: string;

  constructor(private store: Store<AppState>, private socketService: SocketService) {
    this.store.select((state: AppState) => state.gameName)
      .subscribe((gameName: string) => {
        this.gameName = gameName;
      });
  }

  canDeactivate() {
    if (!this.gameName || confirm('Are you sure you want to leave this game?')) {
      this.store.dispatch(new LeaveGameAction());
      this.socketService.leaveGame();
      return true;
    }

    return false;
  }
}
