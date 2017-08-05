import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

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
export class GameComponent implements OnDestroy, OnInit {
  flipped = true;
  allVoted = false;

  votes: Votes;
  players: any[];

  private subscriptions: Subscription[] = [];

  constructor(private socketService: SocketService,
      private store: Store<AppState>,
      private authService: AuthService) {
    this.subscriptions.push(store.select((state: AppState) => state.players)
      .subscribe((players: any[]) => {
        this.players = players;
      }));

    this.subscriptions.push(store.select((state: AppState) => state.votes)
      .subscribe((votes: Votes) => {
        this.votes = votes;
        this.allVoted = Object.keys(votes).length === this.players.length;
      }));
  }

  ngOnInit() {
    this.socketService.init();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  vote(value) {
    this.socketService.castVote(value);
    this.store.dispatch(new VoteAction({ player: this.authService.playerId, vote: value }));
  }
}
