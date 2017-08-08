import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { AppState } from './types';
import { VERSION } from '../version';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  version = VERSION;

  playerName$: Observable<string>;

  notificationOptions = {
    timeOut: 3000,
    showProgressBar: false
  };

  constructor(private store: Store<AppState>) {
    this.playerName$ = store.select((state: AppState) => state.playerName);
  }
}
