const express = require('express');
const socket = require('socket.io');
const path = require('path');

let tasks = [];

const app = express();
const cors = require('cors');

app.use(cors());
// app.use(express.static(path.join(__dirname, '/client')));
app.use((req, res) => {
  res.status(404).send({message: 'Not found...'});
});

const server = app.listen(8000, () => {
  console.log('Server is running on Port:', 8000);
});
const io = socket(server);

io.on('connection', socket => {
  console.log('New client! Its id – ' + socket.id);
  socket.emit('updateData', tasks);

  socket.on('addTask', task => {
    console.log(`Added task: ${task.name} with id: ${task.id} by: ${socket.id}`);
    tasks.push(task);
    socket.broadcast.emit('addTask', task);
  });

  socket.on('removeTask', task => {
    console.log(`Removed task: ${task.name} with id: ${task.id} by: ${socket.id}`);
    tasks = tasks.filter(taskOnServer => taskOnServer.id !== task.id);
    socket.broadcast.emit('removeTask', task);
  });

  socket.on('disconnect', () => {
    console.log('Socket ' + socket.id + ' has left');
  });
});
