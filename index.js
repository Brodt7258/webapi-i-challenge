// implement your API here
const express = require('express');
const server = express();

const db = require('./data/db');

server.use(express.json());

server.get('/', (req, res) => {
  res.send({ Success: 'test' });
});

server.post('/api/users', (req, res) => {
  const { name, bio } = req.body;
  if (!name || !bio) {
    res.status(400).json({ errorMessage: "Please provide name and bio for the user." });
  }
  db.insert({ name, bio })
    .then(({ id }) => {
      res.status(201).json({ name, bio, id });
    })
    .catch(() => {
      res.status(500).json({ error: "There was an error while saving the user to the database" });
    });
});

server.listen(5000, () => {
  console.log('Server listening on port 5000');
});