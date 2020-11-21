import { v4 as uuidv4 } from 'uuid';

const lobbies = {

};

const _lobby = {
  voter: {
    position: {
      x: 1,
      y: 1
    }
  },
  rounds: [
    {

    }
  ],
  players: {

  },
  playerA: {
    name: 'some name',
    currentAgenda: {},
    score: 0,
    socket: {}
  },
  playerB: {
    name: 'some other name',
    currentAgenda: {},
    score: 0,
    socket: {}
  }
};

export function createLobby() {
  const lobby = {
    id: uuidv4(),
    players: {}
  };
  lobby.addPlayer = (player) => {
    lobby.players[player.socket.id] = player;
  }
  lobbies[lobby.id] = lobby;
  return lobby;
}

export function getLobby(lobbyId) {
  return lobbies[lobbyId];
}

export function joinLobby(lobbyId, player) {
  const lobby = lobbies[lobbyId];
  player.socket.join(lobby.id);
  lobby.addPlayer(player);
  return lobby;
}