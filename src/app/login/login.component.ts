import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { AppState } from '../types';
import { AuthService } from '../auth.service';
import { SetPlayerNameAction } from '../actions';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  model = { name: '' };

  constructor(private router: Router, private authService: AuthService, private store: Store<AppState>) { }

  submitForm(value) {
    this.authService.name = this.model.name;
    this.store.dispatch(new SetPlayerNameAction(this.model.name));
    this.router.navigate(['/game']);
  }
}
