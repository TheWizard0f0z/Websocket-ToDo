const express = require('express');
const socket = require('socket.io');

const app = express();

const server = app.listen(process.env.PORT || 8000, () => {
  console.log('Server is running on port: 8000');
});

app.use((req, res) => {
  res.status(404).send({ message: 'Not found...' });
});

const io = socket(server);

const tasks = [];

io.on('connection', socket => {
  console.log('New client! Its id – ' + socket.id);
  socket.emit('updateData', tasks);

  socket.on('addTask', newTask => {
    if (!tasks.find(task => task.id == newTask.id)) {
      tasks.push(newTask);
      socket.broadcast.emit('addTask', newTask);
    }
  });

  socket.on('removeTask', (index, task) => {
    if (tasks.find(deleteTask => deleteTask.id == task.id)) {
      tasks.splice(index, 1);
      socket.broadcast.emit('removeTask', index, task);
    }
  });
});
