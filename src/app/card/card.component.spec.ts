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

  it('should display the given back value on the back', () => {
    component.back = 'J';
    fixture.detectChanges();

    expect((<HTMLElement>el.querySelector('.back')).innerText.trim()).toBe('J');
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

    spyOn(component.cardClick, 'emit');

    const frontEl = debugElement.query(By.css('.front'));
    frontEl.nativeElement.click();

    expect(component.cardClick.emit).toHaveBeenCalledWith('5');
  });
});
