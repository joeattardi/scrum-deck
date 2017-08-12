import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Title } from '@angular/platform-browser';

// tslint:disable-next-line: no-unused-variable
import { AppState } from '../types';
import { SetGameIdAction, SetPlayerNameAction } from '../actions';
import { SocketService } from '../socket.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  model = { name: '' };

  gameId: string;
  loading = false;

  constructor(private router: Router, private route: ActivatedRoute,
    private store: Store<AppState>, private socketService: SocketService,
    private title: Title) { }

  ngOnInit() {
    this.gameId = this.route.snapshot.paramMap.get('id');
    this.title.setTitle('Join Game | ScrumDeck');
  }

  submitForm(value) {
    this.loading = true;
    this.store.dispatch(new SetPlayerNameAction(this.model.name));
    this.store.dispatch(new SetGameIdAction(this.gameId));

    this.socketService.init();
    this.router.navigate(['/game', this.gameId]);
  }
}
