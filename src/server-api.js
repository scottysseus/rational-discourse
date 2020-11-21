import { io } from 'socket.io-client';

const currentSocket = {};

export async function connectToServer() {
  const socket = io('http://localhost:3001');

  new Promise((resolve, reject) => {
    socket.on('connect', () => { 
      socket.emit('echo', {msg: 'foo'}, (response) => { console.log('Got this server', response)});
      console.log('Connected to Socket.io Server');
    });
  });

  

}