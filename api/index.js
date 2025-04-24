const express = require('express');
const app = express();

// Временное хранилище в памяти
let todos = [];

app.get('/api/todos', (req, res) => {
  res.json(todos);
});

app.post('/api/todos', express.json(), (req, res) => {
  const newTodo = { id: Date.now(), ...req.body };
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

module.exports = app; // Для Vercel
