const express = require('express');
const socket = require('socket.io');
const path = require('path');

const tasks = ['Zakupy', 'Wstawić pranie', 'Zapłacić rachunki'];

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
    console.log(`Added: ${task} by: ${socket.id}`);
    tasks.push(task);
    socket.broadcast.emit('addTask', task);
  });

  socket.on('removeTask', index => {
    console.log(`Removed index: ${index} by: ${socket.id}`);
    tasks.splice(index, 1);
    socket.broadcast.emit('removeTask', index, false);
  });

  socket.on('disconnect', () => {
    console.log('Oh, socket ' + socket.id + ' has left');
  });
});
