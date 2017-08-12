import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent {
  @Input() value: string;
  @Input() flipped = false;
  @Input() inDeck = false;
  @Input() back: string;

  @Output() cardClick = new EventEmitter<string>();

  onCardClicked(event) {
    this.cardClick.emit(this.value);
  }
}
