import React, {useState, useEffect, useContext} from 'react';
import NotesList from './NotesList';
import './KeepNotes.css';
import {nanoid} from 'nanoid';
import SearchBar from './SearchBar';
import noteImage from './images/pencil.png';
import {AuthContext} from '../../context/auth-context';


const KeepNotes = () => {
  
  const [notes, setNotes] = useState([]);
  const ctx = useContext(AuthContext);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const responseData = await fetch(
          `${process.env.REACT_APP_BACKEND_API}/notes/user/${ctx.userId}`
        );
        const data = await responseData.json();
        setNotes(data.notes);
      } catch (err) {
        console.log(err);
      }
    };
    fetchNotes();
  },[ctx.userId]);

  const addNote = (text) => {
    const newNote = {
      id: nanoid(),
      text: text,
      date: new Date().getDate() +'-' + new Date().getMonth() + '-' + new Date().getFullYear(),
    };
    const newNotes = [...notes, newNote];
    setNotes(newNotes);
  };

  const deleteNote = async (id) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_API}/notes/user/${ctx.userId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authersation: 'Bearer ' + ctx.token,
          },
          body: JSON.stringify({
            noteId: id,
          }),
        }
      );
      await response.json();
      const newNotes = notes.filter((note) => note.id !== id);
      setNotes(newNotes);
    } catch (err) {
      console.log(err);
    }
  };

  const [searchText, setSearchText] = useState('');

  return (
    <div className="main">
      <h1 className="heading">
        Notes <img src={noteImage} className="notes-image" alt="" />{' '}
      </h1>
      <SearchBar searchHandler={setSearchText} />
      <NotesList
        notes={notes.filter((note) =>
          note.text.toLowerCase().includes(searchText)
        )}
        addNoteHandler={addNote}
        deleteHandler={deleteNote}
      />
    </div>
  );
};

export default KeepNotes;
