import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { CardComponent } from './card/card.component';
import { DeckComponent } from './deck/deck.component';
import { LoginComponent } from './login/login.component';
import { GameComponent } from './game/game.component';

import { AuthGuard } from './auth-guard.service';
import { AuthService } from './auth.service';
import { SocketService } from './socket.service';

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
    GameComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [AuthGuard, AuthService, SocketService],
  bootstrap: [AppComponent]
})
export class AppModule { }
