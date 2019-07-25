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

server.get('/api/users', (req, res) => {
  db.find()
    .then(data => {
      res.status(200).json(data);
    })
    .catch(() => {
      res.status(500).json({ error: "The users information could not be retrieved." });
    });
});

server.get('/api/users/:id', (req, res) => {
  const { id } = req.params;
  db.findById(id)
    .then(data => {
      res.status(200).json(data);
    })
    .catch(() => {
      res.status(404).json({ message: "The user with the specified ID does not exist." });
    })
});

server.delete('/api/users/:id', (req, res) => {
  const { id } = req.params;
  db.remove(id)
    .then(success => {
      if (success) {
        res.status(204).end();
      } else {
        res.status(404).json({ message: "The user with the specified ID does not exist." });
      }
    })
    .catch(() => {
      res.status(500).json({ error: "The user could not be removed" });
    })
});

server.listen(5000, () => {
  console.log('Server listening on port 5000');
});