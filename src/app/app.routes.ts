import { Routes } from '@angular/router';

import { AuthGuard } from './auth-guard.service';
import { LeaveGameGuard } from './leave-game-guard.service';
import { GameComponent } from './game/game.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { NewGameComponent } from './new-game/new-game.component';
import { NotFoundComponent } from './not-found/not-found.component';

export const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'new', component: NewGameComponent },
  {
    path: 'game/:id',
    component: GameComponent,
    canActivate: [AuthGuard],
    canDeactivate: [LeaveGameGuard]
  },
  { path: 'join/:id', component: LoginComponent },
  { path: '**', component: NotFoundComponent }
];
