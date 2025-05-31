import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [notes, setNotes] = useState([]);
  const [text, setText] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/notes')
      .then(res => setNotes(res.data));
  }, []);

  const addNote = () => {
    axios.post('http://localhost:5000/notes', { text })
      .then(res => {
        setNotes(prev => [...prev, res.data]);
        setText('');
      });
  };

  const deleteNote = (id) => {
    axios.delete(`http://localhost:5000/notes/${id}`)
      .then(() => {
        setNotes(prev => prev.filter(note => note.id !== id));
      });
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Notes App</h1>
      <input value={text} onChange={e => setText(e.target.value)} placeholder="Write a note..." />
      <button onClick={addNote}>Add</button>
      <ul>
        {notes.map(note => (
          <li key={note.id}>
            {note.text} <button onClick={() => deleteNote(note.id)}>❌</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
