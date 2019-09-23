import React, {useState, useEffect} from 'react';
import Amplify, { API, graphqlOperation} from 'aws-amplify';
import aws_exports from './aws-exports';
import { withAuthenticator } from 'aws-amplify-react';
import { listNotes } from './graphql/queries';
import { createNote, deleteNote } from './graphql/mutations';

Amplify.configure(aws_exports);

const App = () => {
  const [notes, setNotes] = useState([]);
  const [note, setNote] = useState("");

  useEffect(() => {
    handleListNotes();

  }, []);

  const handleListNotes = async () => {
    const { data } = await API.graphql(graphqlOperation(listNotes));
    setNotes(data.listNotes.items);
  }

  const handleAddNote = async event => {
    event.preventDefault();
    const temp = { note };
    const { data } = await API.graphql(graphqlOperation(createNote, { input: temp}));
    const newNote = data.createNote;
    const updatedNotes = [newNote, ...notes ];
    setNotes(updatedNotes);
    setNote("");
  }

  const handleDeleteNote = async id => {
    const temp = { id };
    const { data } = await API.graphql(graphqlOperation(deleteNote, { input: temp}));
    const deletedNoteId = data.deleteNote.id;
    const deletedNoteIdx = notes.findIndex(note => note.id === deletedNoteId);
    const updatedNotes = [...notes.slice(0, deletedNoteIdx), ...notes.slice(deletedNoteIdx + 1)];
    setNotes(updatedNotes);
  }

  return (
    <div className="flex flex-column items-center justify-center bg-washed-red pa3">
      <h1 className="courier f2">
        Amplify Notes
      </h1>
      {/* note form */}

      <form className="mb3" onSubmit={handleAddNote}>
        <input type="text" placeholder="Enter note" className="pa2 f4" value={note} onChange={({ target }) => setNote(target.value)}/>
        <button type="submit" className="pa2 f4">Add</button>
      </form>

      {/* note list */}
      <div>
        {notes.map((item, i) => (
          <div key={item.id} className="flex items-center">
            <li className="list pa1 f3">{item.note}</li>
            <button className="bg-transparent bn f4" onClick={() => handleDeleteNote(item.id)}><span>&times;</span></button>
          </div>
        ))}

      </div>
    </div>
  );
}

export default withAuthenticator(App, { includeGreetings: true });
