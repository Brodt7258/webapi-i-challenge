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
    });
};

const addUser = (user, state, setState) => {
  axios.post(server, user)
    .then(({ data }) => {
      setState([
        ...state,
        data
      ]);
    });
};

const updateUser = (id, user, state, setState) => {
  axios.put(`${server}/${id}`, user)
    .then(({ data }) => {
      console.log(data);
      const UserIndex = state.findIndex(e => e.id === id);
      const newState = [ ...state ];
      newState[UserIndex] = data;
      setState(newState);
    });
}

function App() {
  const [users, setUsers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    bio: ''
  });
  
  useEffect(() => {
    getAllUsers(setUsers);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editingId) {
      console.log('ADD');
      addUser(formData, users, setUsers);
    } else {
      console.log('EDIT');
      updateUser(editingId, formData, users, setUsers);
    }
  };

  const handleEditing = ({ id, name, bio }) => {
    setEditingId(id);
    setFormData({ name, bio });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({
      name: '',
      bio: ''
    });
  };

  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <h2>{editingId ? 'Edit' : 'Add'} User</h2>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
        />
        <label htmlFor="bio">Bio</label>
        <input
          id="bio"
          name="bio"
          type="text"
          value={formData.bio}
          onChange={handleChange}
        />
        <button type="submit">Submit</button>
        {editingId &&
          <button onClick={cancelEdit}>
            Cancel
          </button>
        }
      </form>
      <h2>Users</h2>
      <ul>
        {users.length
          ? users.map(e => (
            <li key={e.id}>
              <h3>{e.name}</h3>
              <p>{e.bio}</p>
              <button onClick={() => handleEditing(e)}>
                Edit
              </button>
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
