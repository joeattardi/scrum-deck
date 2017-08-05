import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { AppState } from '../types';
import { AuthService } from '../auth.service';
import { SocketService } from '../socket.service';
import { VoteAction } from '../actions';
import { Votes } from '../types';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  flipped = true;

  votes: Votes;

  players$: Observable<string[]>;
  votes$: Observable<Votes>;

  constructor(private socketService: SocketService,
      private store: Store<AppState>,
      private authService: AuthService) {
    this.players$ = store.select((state: AppState) => state.players);

    this.votes$ = store.select((state: AppState) => state.votes);
    this.votes$.subscribe((votes: Votes) => this.votes = votes);
  }

  ngOnInit() {
    this.socketService.init();
  }

  vote(value) {
    this.socketService.castVote(value);
    this.store.dispatch(new VoteAction({ player: this.authService.name, vote: value }));
  }
}
