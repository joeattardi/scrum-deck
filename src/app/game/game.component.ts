import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { AppState } from '../types';
import { AuthService } from '../auth.service';
import { SocketService } from '../socket.service';
import { HideCardsAction, NewGameAction, ShowCardsAction, VoteAction } from '../actions';
import { Votes } from '../types';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnDestroy, OnInit {
  allVoted = false;
  myVote: string;
  voted = false;

  cardsVisible = false;
  votes: Votes;
  players: any[];
  playerId: string;

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
        this.voted = this.playerId in votes;
      }));

    this.subscriptions.push(store.select((state: AppState) => state.playerId)
      .subscribe((playerId: string) => {
        this.playerId = playerId;
      }));

    this.subscriptions.push(store.select((state: AppState) => state.cardsVisible)
      .subscribe((cardsVisible: boolean) => {
        this.cardsVisible = cardsVisible;
      }));
  }

  ngOnInit() {
    this.socketService.init();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  flipCards() {
    if (this.cardsVisible) {
      this.store.dispatch(new HideCardsAction());
      this.socketService.hideCards();
    } else {
      this.store.dispatch(new ShowCardsAction());
      this.socketService.showCards();
    }
  }

  vote(value) {
    this.socketService.castVote(value);
    this.store.dispatch(new VoteAction({ player: this.authService.playerId, vote: value }));
    this.myVote = value;
    this.voted = true;
  }

  playAgain() {
    this.store.dispatch(new NewGameAction());
    this.socketService.playAgain();
    this.voted = false;
    this.myVote = null;
  }
}
