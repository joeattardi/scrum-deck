import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardPlaceholderComponent } from './card-placeholder.component';

describe('CardPlaceholderComponent', () => {
  let component: CardPlaceholderComponent;
  let fixture: ComponentFixture<CardPlaceholderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardPlaceholderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardPlaceholderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
