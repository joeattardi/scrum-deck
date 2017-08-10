import * as Actions from './actions';
import { SocketService } from './socket.service';
import * as socketConstants from '../../shared/socketConstants';

const mockAuthService = <any>{
  name: 'Joe'
}

const mockStore = <any>{
  dispatch: action => {}
};

const mockNotificationsService = <any>{
  info: (title, message) => {},
  success: (title, message) => {}
};

const mockSocket = <any> { emit: (message, data) => {} };

describe('Socket Service', () => {
  const socketService = new SocketService(mockAuthService, mockStore, mockNotificationsService);
  socketService.setSocket(mockSocket);

  beforeEach(() => {
    spyOn(mockStore, 'dispatch');
    spyOn(mockNotificationsService, 'info');
  });

  it('should join the game after connecting', () => {
    const mockSocket = { emit: jasmine.createSpy('emit') };
    socketService.handleConnection(mockSocket);
    expect(mockSocket.emit).toHaveBeenCalledWith('join', 'Joe');
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
    expect(mockSocket.emit).toHaveBeenCalledWith(socketConstants.VOTE, '5');
    expect(mockNotificationsService.success).toHaveBeenCalledWith('Vote Cast', 'You voted 5');
  });

  it('should emit a NEW_GAME message and send a notification when starting a new game', () => {
    spyOn(mockSocket, 'emit');

    socketService.newGame();
    expect(mockSocket.emit).toHaveBeenCalledWith(socketConstants.NEW_GAME);
    expect(mockNotificationsService.info).toHaveBeenCalledWith('New Game', 'Starting a new game');
  });

  it('should emit a SHOW_CARDS message when showing cards', () => {
    spyOn(mockSocket, 'emit');
    socketService.showCards();
    expect(mockSocket.emit).toHaveBeenCalledWith(socketConstants.SHOW_CARDS);
  });

  it('should emit a HIDE_CARDS message when hiding cards', () => {
    spyOn(mockSocket, 'emit');
    socketService.hideCards();
    expect(mockSocket.emit).toHaveBeenCalledWith(socketConstants.HIDE_CARDS);
  });
});
