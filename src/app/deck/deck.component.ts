import { Component, EventEmitter, Output } from '@angular/core';
import debug from 'debug';

const logger = debug('ScrumDeck:DeckComponent');

@Component({
  selector: 'app-deck',
  templateUrl: './deck.component.html',
  styleUrls: ['./deck.component.scss']
})
export class DeckComponent {
  @Output() vote = new EventEmitter<string>();

  onCardClicked(card) {
    logger('Submitting vote:', card);
    this.vote.emit(card);
  }
}
