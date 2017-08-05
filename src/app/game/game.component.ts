import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { AppState } from '../state';
import { SocketService } from '../socket.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  flipped = true;

  players$: Observable<string[]>;

  constructor(private socketService: SocketService, private store: Store<AppState>) {
    this.players$ = store.select((state: AppState) => state.players);
  }

  ngOnInit() {
    this.socketService.init();
  }
}
