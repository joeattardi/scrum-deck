import { Routes } from '@angular/router';

import { AuthGuard } from './auth-guard.service';
import { GameComponent } from './game/game.component';
import { LoginComponent } from './login/login.component';

export const appRoutes: Routes = [
  { path: '', component: LoginComponent },
  {
    path: 'game',
    component: GameComponent,
    canActivate: [AuthGuard]
  }
];
