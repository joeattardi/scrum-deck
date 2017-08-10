import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { SimpleNotificationsModule } from 'angular2-notifications';

import { AppComponent } from './app.component';
import { CardComponent } from './card/card.component';
import { DeckComponent } from './deck/deck.component';
import { LoginComponent } from './login/login.component';
import { GameComponent } from './game/game.component';

import { AuthGuard } from './auth-guard.service';
import { SocketService } from './socket.service';

import { cardsVisibleReducer } from './reducers/cards-visible';
import { phaseReducer } from './reducers/phase';
import { playerIdReducer } from './reducers/player-id';
import { playerNameReducer } from './reducers/player-name';
import { playersReducer } from './reducers/players';
import { voteReducer } from './reducers/vote';

import { environment } from '../environments/environment';
import { CardPlaceholderComponent } from './card-placeholder/card-placeholder.component';

const appRoutes: Routes = [
  { path: '', component: LoginComponent },
  {
    path: 'game',
    component: GameComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  declarations: [
    AppComponent,
    CardComponent,
    DeckComponent,
    LoginComponent,
    GameComponent,
    CardPlaceholderComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    SimpleNotificationsModule.forRoot(),
    RouterModule.forRoot(appRoutes),
    StoreModule.forRoot({
      cardsVisible: cardsVisibleReducer,
      playerId: playerIdReducer,
      playerName: playerNameReducer,
      players: playersReducer,
      phase: phaseReducer,
      votes: voteReducer
    }),
    !environment.production ? StoreDevtoolsModule.instrument({ maxAge: 25 }) : []
  ],
  providers: [AuthGuard, SocketService],
  bootstrap: [AppComponent]
})
export class AppModule { }
