import express from 'express';
import { createServer } from 'http';
import { createLobby, joinLobby, scoreTweetInLobby } from './lobby.mjs';
import {Server } from 'socket.io';

const app = express();
const http = createServer(app);
const io = new Server(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ["GET", "POST"]
  }
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});


io.on('connection', (socket) => {
  console.log('User Conncected', socket.id);
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

http.listen(3001, () => {
  console.log('listening on *:3001');
});