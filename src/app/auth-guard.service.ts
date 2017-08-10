import { CanActivate, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { AppState } from './types';

@Injectable()
export class AuthGuard implements CanActivate {
  private playerName: string;

  constructor(private router: Router, private store: Store<AppState>) {
    this.store.select((state: AppState) => state.playerName)
      .subscribe((playerName: string) => {
        this.playerName = playerName;
      });
  }

  canActivate() {
    if (!this.playerName) {
      this.router.navigate(['/']);
      return false;
    }

    return true;
  }
}
