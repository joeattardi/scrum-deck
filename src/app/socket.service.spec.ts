import { Observable } from 'rxjs/Observable';

import * as Actions from './actions';
import { SocketService } from './socket.service';
import * as socketConstants from '../../shared/socketConstants';

const state = {
  gameId: Observable.of('asdf'),
  playerName: Observable.of('Joe')
};

const mockStore = <any>{
  dispatch(action) { },
  select(selectorFn) {
    return selectorFn(state);
  }
};

const mockNotificationsService = <any>{
  info: (title, message) => {},
  success: (title, message) => {}
};

const mockSocket = <any> { 
  emit(message, data) { },
  disconnect() { }
};

describe('Socket Service', () => {
  const socketService = new SocketService(mockStore, mockNotificationsService);
  socketService.setSocket(mockSocket);

  beforeEach(() => {
    spyOn(mockStore, 'dispatch');
    spyOn(mockNotificationsService, 'info');
  });

  it('should disconnect the socket when leaving the game', () => {
    spyOn(mockSocket, 'disconnect');
    socketService.leaveGame();
    expect(mockSocket.disconnect).toHaveBeenCalled();
  });

  it('should dispatch a SetPlayerIdAction when the player id is received', () => {
    socketService.handlePlayerId('abc123');
    expect(mockStore.dispatch).toHaveBeenCalledWith(new Actions.SetPlayerIdAction('abc123'));
  });

  it('should dispatch a PlayerJoinedAction and send a notification when a new player joins', () => {
    const player = { id: 'abc123', name: 'Joe' };
    socketService.handlePlayerJoined(player);

    expect(mockStore.dispatch).toHaveBeenCalledWith(new Actions.PlayerJoinedAction(player));
    expect(mockNotificationsService.info).toHaveBeenCalledWith('Player Joined', 'Joe joined the game');
  });

  it('should dispatch a PlayerLeftAction and send a notification when a player leaves', () => {
    const player = { id: 'abc123', name: 'Joe' };
    socketService.handlePlayerLeft(player);

    expect(mockStore.dispatch).toHaveBeenCalledWith(new Actions.PlayerLeftAction(player));
    expect(mockNotificationsService.info).toHaveBeenCalledWith('Player Left', 'Joe left the game');
  });

  it('should dispatch a SetGameState action when receiving updated game state', () => {
    const gameState = {
      cardsVisible: false,
      gameId: 'asdf',
      gameName: 'My Game',
      playerId: 'abc123',
      playerName: 'Joe',
      players: [{ id: 'abc123', name: 'Joe' }],
      phase: 'VOTING',
      votes: {}
    };
    socketService.handleGameState(gameState);
    expect(mockStore.dispatch).toHaveBeenCalledWith(new Actions.SetGameStateAction(gameState));
  });

  it('should dispatch a VoteAction and send a notification when a player votes', () => {
    const vote = {
      player: {
        id: 'abc123',
        name: 'Joe'
      },
      vote: '5'
    };
    socketService.handleVote(vote);
    expect(mockStore.dispatch).toHaveBeenCalledWith(new Actions.VoteAction({ player: 'abc123', vote: '5' }));
    expect(mockNotificationsService.info).toHaveBeenCalledWith('Player Voted', 'Joe voted');
  });

  it('should dispatch a NewGameAction and send a notification when a new game is started', () => {
    socketService.handleNewGame();
    expect(mockStore.dispatch).toHaveBeenCalledWith(new Actions.NewGameAction());
    expect(mockNotificationsService.info).toHaveBeenCalledWith('New Game', 'Starting a new game');
  });

  it('should dispatch a ShowCardsAction and send a notification when all players have voted', () => {
    socketService.handleShowCards();
    expect(mockStore.dispatch).toHaveBeenCalledWith(new Actions.ShowCardsAction());
    expect(mockNotificationsService.info).toHaveBeenCalledWith('Voting Complete', 'All players have voted');
  });

  it('should dispatch a HideCardsAction when hiding the cards', () => {
    socketService.handleHideCards();
    expect(mockStore.dispatch).toHaveBeenCalledWith(new Actions.HideCardsAction());
  });

  it('should emit a VOTE message and send a notification when voting', () => {
    spyOn(mockSocket, 'emit');
    spyOn(mockNotificationsService, 'success');

    socketService.castVote('5');
    expect(mockSocket.emit).toHaveBeenCalledWith(socketConstants.VOTE, { gameId: 'asdf', vote: '5' });
    expect(mockNotificationsService.success).toHaveBeenCalledWith('Vote Cast', 'You voted 5');
  });

  it('should emit a NEW_GAME message and send a notification when starting a new game', () => {
    spyOn(mockSocket, 'emit');

    socketService.newGame();
    expect(mockSocket.emit).toHaveBeenCalledWith(socketConstants.NEW_GAME, 'asdf');
    expect(mockNotificationsService.info).toHaveBeenCalledWith('New Game', 'Starting a new game');
  });
});
