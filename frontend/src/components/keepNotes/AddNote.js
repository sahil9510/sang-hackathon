import React, {useState, useContext} from 'react';
import './Note.css';
import {AuthContext} from '../../context/auth-context';


const AddNote = ({addNoteHandler}) => {
  const ctx = useContext(AuthContext);
   const [noteText, setNoteText] = useState('');
  const characterLimit = 200;

  const changeHandler = (e) => {
    if (characterLimit - e.target.value.length >= 0) {
      setNoteText(e.target.value);
    }
  };

  const saveHandler = async (e) => {
    if (noteText.trim().length > 0) {
      addNoteHandler(noteText);
      setNoteText('');

      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_API}/notes`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authersation: 'Bearer ' + ctx.token,
          },
          body: JSON.stringify({
            text: noteText,
            date: new Date().getDate() +'-' + new Date().getMonth() + '-' + new Date().getFullYear(),
            creator: ctx.userId
          }),
        });
        await response.json();
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <React.Fragment>
      <div className="note add">
        <textarea
          rows="6"
          // cols="10"
          placeholder="Add a note..."
          value={noteText}
          onChange={changeHandler}
        ></textarea>
        <div className="note-footer">
          <small>{characterLimit - noteText.length} remaining</small>
          <button className="save" onClick={saveHandler}>
            Save
          </button>
        </div>
      </div>
    </React.Fragment>
  );
};

export default AddNote;
