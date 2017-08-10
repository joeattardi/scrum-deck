import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CardComponent } from '../card/card.component';
import { DeckComponent } from './deck.component';

describe('Deck Component', () => {
  let component: DeckComponent;
  let fixture: ComponentFixture<DeckComponent>;
  let debugElement: DebugElement;
  let el: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CardComponent, DeckComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeckComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    el = debugElement.nativeElement;
    fixture.detectChanges();
  });

  it('should fire an event when a card is clicked', () => {
    spyOn(component.vote, 'emit');
    let card = el.querySelector('app-card[value="5"] .front');
    card.dispatchEvent(new MouseEvent('click'));
    expect(component.vote.emit).toHaveBeenCalledWith('5');

    card = el.querySelector('app-card[value="8"] .front');
    card.dispatchEvent(new MouseEvent('click'));
    expect(component.vote.emit).toHaveBeenCalledWith('8');
  });
});
