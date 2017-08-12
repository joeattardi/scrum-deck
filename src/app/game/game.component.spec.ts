import { ActivatedRoute, Router } from '@angular/router';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs/Subject';

// tslint:disable-next-line: no-unused-variable
import { AppState } from '../types';
import { CardComponent } from '../card/card.component';
import { CardPlaceholderComponent } from '../card-placeholder/card-placeholder.component';
import { DeckComponent } from '../deck/deck.component';
import { GameComponent } from './game.component';
import { LoaderComponent } from '../loader/loader.component';
import { SocketService } from '../socket.service';

const state = {
  cardsVisible: new Subject(),
  gameName: Observable.of('My Game'),
  playerId: new Subject(),
  playerName: new Subject(),
  players: new Subject(),
  phase: new Subject(),
  votes: new Subject()
};

const mockRouter = jasmine.createSpyObj('router', ['navigate']);

const mockSocketService = {
  init() { },
  joinGame: jasmine.createSpy('joinGame').and.returnValue(Promise.resolve())
};

const mockStore = {
  select(selectorFn) {
    return selectorFn(state);
  }
};

const mockActivatedRoute = {
  snapshot: {
    paramMap: {
      get() {
        return 'asdf';
      }
    }
  }
};

describe('Game Component', () => {
  let component: GameComponent;
  let fixture: ComponentFixture<GameComponent>;
  let debugElement: DebugElement;
  let el: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CardComponent, CardPlaceholderComponent, DeckComponent, GameComponent, LoaderComponent],
      providers: [
        { provide: SocketService, useValue: mockSocketService },
        { provide: Store, useValue: mockStore },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    el = debugElement.nativeElement;

    state.players.next([
      { id: 'abc123', name: 'Joe' },
      { id: 'def456', name: 'Bob' }
    ]);

    state.votes.next({});
    state.playerId.next('abc123');
    state.cardsVisible.next(false);

    component.loading = false;

    fixture.detectChanges();
  });

  it('should render a list of participants', () => {
    let participants = el.querySelectorAll('#participants ul li');
    expect((<HTMLElement> participants[0]).innerText).toBe('Joe');
    expect((<HTMLElement> participants[1]).innerText).toBe('Bob');

    state.players.next([
      { id: 'abc123', name: 'Joe' },
      { id: 'def456', name: 'Bob' },
      { id: 'ghi789', name: 'Sam' }
    ]);
    fixture.detectChanges();

    participants = el.querySelectorAll('#participants ul li');
    expect((<HTMLElement> participants[0]).innerText).toBe('Joe');
    expect((<HTMLElement> participants[1]).innerText).toBe('Bob');
    expect((<HTMLElement> participants[2]).innerText).toBe('Sam');
  });

  it('should show the game name', () => {
    const gameTitleEl = el.querySelector('#game-container h1');
    expect(gameTitleEl.innerHTML).toBe('My Game');
  });

  it('should render a player div for each player', () => {
    const playerDivs = el.querySelectorAll('#game-area .player');
    expect(playerDivs.length).toBe(2);
  });

  it('should render a deck if the player has not voted', () => {
    component.voted = false;
    fixture.detectChanges();
    expect(el.querySelector('app-deck')).toBeTruthy();
  });

  it('should not render a deck, and show the vote if the player has voted', () => {
    component.voted = true;
    component.myVote = '5';
    fixture.detectChanges();

    expect(el.querySelector('app-deck')).toBeFalsy();

    const votedEl = el.querySelector('#voted');
    const voteCard = votedEl.querySelector('app-card .value');
    expect(voteCard.innerHTML).toBe('5');
  });

  it('should join the game with the id from the route', () => {
    expect(mockSocketService.joinGame).toHaveBeenCalledWith('asdf');
  });
});
