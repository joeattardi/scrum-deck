import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { AppState } from '../types';
import { SetPlayerNameAction } from '../actions';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  model = { name: '' };

  constructor(private router: Router, private store: Store<AppState>) { }

  submitForm(value) {
    this.store.dispatch(new SetPlayerNameAction(this.model.name));
    this.router.navigate(['/game']);
  }
}
