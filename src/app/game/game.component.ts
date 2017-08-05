import { Component, OnInit } from '@angular/core';

import { SocketService } from '../socket.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  flipped = true;

  constructor(private socketService: SocketService) { }

  ngOnInit() {
    this.socketService.init();
  }
}
