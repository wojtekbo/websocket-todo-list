const express = require('express');
const app = express();

const path = require('path');

const http = require('http');
const server = http.createServer(app);
const {Server} = require('socket.io');
const io = new Server(server);

const tasks = [];

app.use(express.static(path.join(__dirname, '/client/public')));

// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '/client/build/index.html'));
// });

io.on('connection', socket => {
  console.log('a user connected');
});

server.listen(8000, () => {
  console.log('listening on *:3000');
});
