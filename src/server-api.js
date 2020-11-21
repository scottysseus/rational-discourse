import { io } from 'socket.io-client';

export async function connectToServer() {
  const socket = io('http://localhost:3001');

  const connected = new Promise((resolve, reject) => {
    socket.on('connect', () => { 
      socket.emit('echo', {msg: 'foo'}, (response) => { console.log('Got this server', response)});
      console.log('Connected to Socket.io Server with id', socket.id);
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
      return new Promise((resolve, reject) => {
        socket.emit('start-game', playerInfo, resolve);
      });
    },
    /**
     * @param lobbyId the uuid of the lobby
     * @param playerInfo.name Name of the player / party
     */
    async joinGame(lobbyId, playerInfo) {
      return new Promise((resolve, reject) => {
        socket.emit('join-game', lobbyId, playerInfo, resolve);
      });
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
    /**
     * @param {string} tweet
     */
    sendTweet(tweet) {
      socket.to(lobbyId).emit('tweet', socket.id, tweet);
    },
    /**
     * @param {function} callback
     */
    onTweet(callback) {
      socket.on('tweet', callback);
    }
  };
}