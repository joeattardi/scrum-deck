import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { AppState } from '../types';
import { SocketService } from '../socket.service';
import { NewGameAction, VoteAction } from '../actions';
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
  loading = true;

  cardsVisible = false;
  votes: Votes;
  players: any[];
  playerId: string;

  gameName$: Observable<string>;

  private subscriptions: Subscription[] = [];

  constructor(private socketService: SocketService, private store: Store<AppState>, private route: ActivatedRoute, private router: Router) {
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

    this.gameName$ = store.select((state: AppState) => state.gameName);
  }

  ngOnInit() {
    this.socketService.joinGame(this.route.snapshot.paramMap.get('id'))
      .then(() => {
        this.loading = false;
      })
      .catch(err => {
        alert(err);
        this.router.navigate(['/']);
      });
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  vote(value) {
    this.socketService.castVote(value);
    this.store.dispatch(new VoteAction({ player: this.playerId, vote: value }));
    this.myVote = value;
    this.voted = true;
  }

  newGame() {
    this.store.dispatch(new NewGameAction());
    this.socketService.newGame();
    this.voted = false;
    this.myVote = null;
  }
}
