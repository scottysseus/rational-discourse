import { io } from 'socket.io-client';

export async function connectToServer() {
  const socket = io('http://localhost:3001');
  //const socket = io('https://www.nmoadev.net/node');

  let lobbyId = null;
  let playerName = '<unset>';
  const connected = new Promise((resolve, reject) => {
    socket.on('connect', () => { 
      resolve();
    });
  });

  await connected;

  return {
    /**
     * @param playerInfo.name Name of the player / party
     * @return {}
     */
    async startGame(playerInfo) {
      const p = new Promise((resolve, reject) => {
        socket.emit('start-game', playerInfo, resolve);
      });

      const lobby = await p;
      playerName = playerInfo.name;
      lobbyId = lobby.id;

      return lobby;
    },
    /**
     * @param lobbyId the uuid of the lobby
     * @param playerInfo.name Name of the player / party
     */
    async joinGame(toJoin, playerInfo) {
      const p = new Promise((resolve, reject) => {
        socket.emit('join-game', toJoin, playerInfo, resolve);
      });
      
      const lobby = await p;
      playerName = playerInfo.name;
      lobbyId = lobby.id;

      return lobby;
    },
    /**
     * @
     */
    onAgendaState(callback) {
      socket.on('begin-agenda', callback);
    },
    onBattleState(callback) {
      socket.on('begin-battle', callback);
    },
    onWatchState(callback) {
      socket.on('begin-watch', callback);
    },
    onEndGame(callback) {
      socket.on('begin-endgame', callback);
    },
    onScoreChange(callback) {
      socket.on('score-changed', callback);
    },
    /**
     * @param {string} tweet
     */
    sendTweet(tweet) {
      socket.emit('tweet', {playerName, tweet, lobbyId});
    },
    /**
     * @param {function} callback
     */
    onTweet(callback) {
      socket.on('tweet', callback);
    }
  };
}