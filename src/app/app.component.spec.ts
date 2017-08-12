import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { Store } from '@ngrx/store';

import { AppComponent } from './app.component';

const mockStore = <any> {
  select(selectorFn) {
    return Observable.of('Joe');
  }
};

describe('App Component', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let debugElement: DebugElement;
  let el: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent],
      providers: [{ provide: Store, useValue: mockStore }],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    el = debugElement.nativeElement;
    fixture.detectChanges();
  });

  it('should display the player\'s name in the header', () => {
    const playerNameEl = <HTMLElement> el.querySelector('#player-name');
    expect(playerNameEl.innerText.trim()).toBe('Joe');
  });
});
