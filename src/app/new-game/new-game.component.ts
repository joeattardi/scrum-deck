import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

// tslint:disable-next-line: no-unused-variable
import { AppState } from '../types';
import { SetGameNameAction, SetPlayerNameAction } from '../actions';
import { SocketService } from '../socket.service';

@Component({
  selector: 'app-new-game',
  templateUrl: './new-game.component.html',
  styleUrls: ['./new-game.component.scss']
})
export class NewGameComponent implements OnInit {
  constructor(private router: Router, private store: Store<AppState>, private socketService: SocketService) { }

  @ViewChild('gameNameField') gameNameField: ElementRef;

  loading = false;

  model = {
    gameName: '',
    playerName: ''
  };

  ngOnInit() {
    this.gameNameField.nativeElement.focus();
  }

  submitForm(value) {
    this.loading = true;
    this.store.dispatch(new SetGameNameAction(this.model.gameName));
    this.store.dispatch(new SetPlayerNameAction(this.model.playerName));

    this.socketService.init();
    this.socketService.createGame(this.model.gameName)
      .then(gameId => {
        this.router.navigate(['/game', gameId]);
      });
  }
}
