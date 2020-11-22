const express = require('express');
const { createServer } = require('http');
const { createLobby, joinLobby, scoreTweetInLobby } = require('./lobby');
const { Server } = require('socket.io');

const app = express();
const http = createServer(app);
const config = require('./config');
const io = new Server(http, {
  cors: {
    origin: '*',
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('User Connected', socket.id);
  socket.on('disconnect', () => {
    console.log('User Disconnected', socket.id);
  });

  socket.on('tweet', ({playerName, tweet, lobbyId}) => {
    try {
      console.log(playerName, 'tweeted', tweet, 'to', lobbyId);
      io.in(lobbyId).emit('tweet', {playerName, tweet});
      scoreTweetInLobby(lobbyId, socket.id, tweet);
    } catch (error) {
      console.log(error);
    }
  });

  socket.on('start-game', async (player, callback) => {
    try {
      const lobby = createLobby(io);

      joinLobby(lobby.id, socket, player);
      
      callback(lobby);
    } catch (error) {
      console.log(error);
    }
  });

  socket.on('join-game', async (lobbyId, player, callback) => {
    try {
      const lobby = joinLobby(lobbyId, socket, player);
      callback(lobby);
    } catch (error) {
      console.log(error);
    }
  });
});

http.listen(config.port, () => {
  console.log(`listening on *:${config.port}`);
});