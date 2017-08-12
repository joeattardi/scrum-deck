import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  constructor(private router: Router, private title: Title) { }

  ngOnInit() {
    this.title.setTitle('ScrumDeck');
  }

  startNewGame() {
    this.router.navigate(['/new']);
  }

  joinGame(gameId) {
    this.router.navigate(['/join', gameId]);
  }
}
