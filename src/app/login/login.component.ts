import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  model = { name: '' };

  constructor(private router: Router, private authService: AuthService) { }

  submitForm(value) {
    this.authService.name = this.model.name;
    this.router.navigate(['/game']);
  }
}
