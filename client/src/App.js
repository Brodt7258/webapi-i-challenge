import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const server = 'http://localhost:5000/api/users';

const getAllUsers = set => {
  axios.get(server)
    .then(({ data }) => {
      set(data);
    });
};

const deleteUser = (id, state, setState) => {
  axios.delete(`${server}/${id}`)
    .then(() => {
      setState(
        state.filter(e => e.id !== id)
      );
    })
};

function App() {
  const [users, setUsers] = useState([]);
  
  useEffect(() => {
    getAllUsers(setUsers);
  }, []);

  return (
    <div className="App">
      <h1>Users</h1>
      <ul>
        {users.length
          ? users.map(e => (
            <li key={e.id}>
              <h3>{e.name}</h3>
              <p>{e.bio}</p>
              <button>Edit</button>
              <button onClick={() => deleteUser(e.id, users, setUsers)}>
                Delete
              </button>
            </li>
          ))
          : <p>no users</p>}
      </ul>
    </div>
  );
};

export default App;
