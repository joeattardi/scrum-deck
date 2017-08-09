import { By } from '@angular/platform-browser';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';

import { CardComponent } from './card.component';

describe('Card Component', () => {
  let component: CardComponent;
  let fixture: ComponentFixture<CardComponent>;
  let debugElement: DebugElement;
  let el: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CardComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardComponent);
    component = fixture.componentInstance;

    debugElement = fixture.debugElement;
    el = debugElement.nativeElement;
  });

  it('should display the given card value', () => {
    component.value = '5';
    fixture.detectChanges();

    const valueEl = debugElement.query(By.css('.value'));
    expect(valueEl.nativeElement.textContent).toBe('5');
  });

  it('should have a class name of `card-{{value}}`', () => {
    component.value = '5';
    fixture.detectChanges();

    const cardEl = debugElement.query(By.css('.card'));
    expect(cardEl.nativeElement.classList).toContain('card-5');
  });

  it('should fire an event when clicking on the front', () => {
    component.value = '5';
    fixture.detectChanges();

    const clickHandler = jasmine.createSpy('clickHandler');
    const subscription = component.cardClick.subscribe(clickHandler);

    const frontEl = debugElement.query(By.css('.front'));
    frontEl.nativeElement.click();

    expect(clickHandler).toHaveBeenCalledWith('5');
    subscription.unsubscribe();
  });
});
