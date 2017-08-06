import { Component } from '@angular/core';

import { VERSION } from '../version';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  version = VERSION;
}
