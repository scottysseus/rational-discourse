const express = require('express');
const { createServer } = require('http');
const { createLobby, joinLobby, scoreTweetInLobby } = require('./lobby');
const { Server } = require('socket.io');

const app = express();
const http = createServer(app);
const config = require('./config');
const io = new Server(http, {
  cors: {
    origin: config.corsDomain,
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('User Connected', socket.id);
  socket.on('disconnect', () => {
    console.log('User Disconnected', socket.id);
  });

  socket.on('tweet', ({playerName, tweet, lobbyId}) => {
    console.log(playerName, 'tweeted', tweet, 'to', lobbyId);
    io.in(lobbyId).emit('tweet', {playerName, tweet});
    scoreTweetInLobby(lobbyId, socket.id, tweet);
  });

  socket.on('start-game', async (player, callback) => {
    player.socket = socket;

    const lobby = createLobby(io);

    joinLobby(lobby.id, player);
    
    callback(lobby);
  });

  socket.on('join-game', async (lobbyId, player, callback) => {
    player.socket = socket;

    const lobby = joinLobby(lobbyId, player);
    console.log('returned', lobby);
    callback(lobby);
  });
});

http.listen(config.port, () => {
  console.log(`listening on *:${config.port}`);
});