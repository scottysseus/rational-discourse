const uuid = require('uuid');
const { EventEmitter } = require('events');
const { Server } = require('socket.io');
const { randomBytes } = require('crypto');
const lobbies = new Map();
const BATTLE_DURATION = 45000;
const LOBBY_TIMEOUT = 5 * 60 * 1000;
const GameStates = {
  PREGAME: 'pregame',
  AGENDA: 'agenda',
  BATTLE: 'battle',
  WATCH: 'watch',
  ENDGAME: 'endgame'
};

const lobby = {
  state: GameStates.PREGAME,
  voter: {
    position: {
      x: 1,
      y: 1
    }
  },
  currentRound: 1,
  rounds: [
    {
      agenda: {

      },
      battle: {

      },
      watch: {

      }
    }
  ],
  players: {

  }
};

function Round() {
  return {
    agendas: new Map(),
    scores: new Map()
  }
}

function LobbyId() {
  return randomBytes(9).toString('base64');
}

/**
 * @param io {Server}
 */
function Lobby(io) {

  const self = {
    id: LobbyId(),
    players: new Map(),
    playerCount: 0,
    currentRound: Round(),
    rounds: [],
    state: GameStates.PREGAME,
    voter: {
      position: {
        x: 0,
        y: 0
      }
    },
    goal: {
      x: 5,
      y: 7
    }
  };

  const goToAgendaPhase = () => {
    startRound();
    io.of('/').to(self.id).emit(`begin-${GameStates.AGENDA}`);
    self.state = GameStates.AGENDA;
    
    // Skip Agenda Selection for now
    gotToBattlePhase();
  };

  const serializePlayers = () => {
    const players = [];
    for (const player of self.players.values()) {
      players.push(player.meta);
    }
    return players;
  };

  const gotToBattlePhase = () => {
    setTimeout(()=> {
      io.of('/').to(self.id).emit(`begin-${GameStates.BATTLE}`, {
        players: serializePlayers(),
        agendas: self.currentRound.agendas
      });
    }, 1500);
  };

  const goToWatchPhase = () => {
    // Determine winning agenda
    // let maxScore = [null, 0]
    // for (score of scores.entries) {
    //   if (score[1] > maxScore[1]) {
    //     maxScore = score;
    //   }
    // }

    // // Lookup agenda by player id
    // const winningAgenda = self.currentRound.agendas(maxScore[0]);
    // self.currentRound.winningAgenda = winningAgenda;
    // io.of('/').to(self.id).emit(`begin-${GameStates.WATCH}`, {
    //   winningAgenda
    // });

    // applyAgendaToVoter(winningAgenda);

    goToCheckGameEndPhase();
  };

  const applyAgendaToVoter = (agenda) => {
    for (const step in agenda) {
      switch (step) {
        case 'up':
          self.voter.postion.y += -1;
          break;
        case 'down':
          self.voter.postion.y += 1;
          break;
        case 'left':
          self.voter.position.x += -1;
          break;
        case 'right':
          break;
      }
    }
  };

  const goToEndGamePhase = () => {
    self.state = GameStates.ENDGAME;
    io.of('/').to(self.id).emit(`begin-${GameStates.ENDGAME}`);
  };

  const goToCheckGameEndPhase = () => {
    if (self.voter.position.y === self.goal.y && self.voter.position.x === self.goal.x) {
      goToEndGamePhase();
    } else {
      goToAgendaPhase();
    }
  };

  const addPlayer = (player) => {
    player.socket.join(self.id);
    console.log('Socket: ', player.socket.id, ' joined ', self.id);
    self.players.set(player.socket.id, player);
    self.playerCount += 1;
    if (self.playerCount == 2) {
      goToAgendaPhase();
    }
  };

  const startRound = () => {
    self.currentRound = Round();
    self.rounds.push(self.currentRound);
    for (const playerId of self.players.keys()) {
      self.currentRound.scores.set(playerId, 0);
    }
    self.currentRound.scores.set()
  };

  const setAgenda = (playerId, agenda) => {
    self.currentRound.agendas.set(playerId, agenda);
    if (self.currentRound.agendas.size == 2) {
      gotToBattlePhase();
    }
  };

  const scoreTweet = (playerId, tweet) => {
    let score = self.currentRound.scores.get(playerId);
    score = (score || 0) + tweet.length;
    self.currentRound.scores.set(playerId, score);
    const scores = {};
    for (const player of self.players.values()) {
      scores[player.meta.name] = self.currentRound.scores.get(player.socket.id) || 0;
    }
    io.in(self.id).emit('score-changed', scores);
  };

  return {
    id: self.id,
    addPlayer,
    scoreTweet
  }
  
}

function createLobby(io) {
  const lobby = Lobby(io);
  const lobbyId = lobby.id;
  lobbies.set(lobbyId, lobby);
  setTimeout(() => {
    lobbies.delete(lobbyId);
    io.in(lobbyId).emit('lobby-closed', lobbyId);
  }, LOBBY_TIMEOUT);
  return lobby;
}

function getLobby(lobbyId) {
  return lobbies.get(lobbyId);
}

function scoreTweetInLobby(lobbyId, playerId, tweet) {
  const lobby = getLobby(lobbyId);
  if (lobby) {
    lobby.scoreTweet(playerId, tweet);
  }
}

function joinLobby(lobbyId, socket, playerMeta) {
  const lobby = getLobby(lobbyId);
  const player = {
    socket,
    meta: playerMeta
  };

  if (!lobby) {
    console.log("can't find lobby");
  }
  lobby.addPlayer(player);
  console.log('Player ', player.socket.id, ' joined lobby ', lobby.id);
  return lobby;
}

module.exports = {
  createLobby,
  getLobby,
  scoreTweetInLobby,
  joinLobby
};