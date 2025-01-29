import { useState, useEffect } from "react";
import api from "../api";
import Note from "../components/Note";
import "../styles/Home.css";

function Home() {
    const [notes, setNotes] = useState([]);
    const [content, setContent] = useState("");
    const [title, setTitle] = useState("");
    const [editNote, setEditNote] = useState(null); // Track note being edited

    useEffect(() => {
        getNotes();
    }, []);

    const getNotes = () => {
        api
            .get("/api/notes/")
            .then((res) => setNotes(res.data))
            .catch((err) => alert(err));
    };

    const deleteNote = (id) => {
        api
            .delete(`/api/notes/delete/${id}/`)
            .then((res) => {
                if (res.status === 204) alert("Note deleted!");
                getNotes();
            })
            .catch((error) => alert(error));
    };

    const createNote = (e) => {
        e.preventDefault();
        api
            .post("/api/notes/", { content, title })
            .then((res) => {
                if (res.status === 201) alert("Note created!");
                getNotes();
            })
            .catch((err) => alert(err));
    };

    const startEditing = (note) => {
        setEditNote(note);
        setTitle(note.title);
        setContent(note.content);
    };

    const updateNote = (e) => {
        e.preventDefault();
        if (!editNote) return;

        api
            .put(`/api/notes/update/${editNote.id}/`, { content, title })
            .then((res) => {
                if (res.status === 200) alert("Note updated!");
                setEditNote(null); // Exit edit mode
                setTitle("");
                setContent("");
                getNotes();
            })
            .catch((err) => alert(err));
    };

    return (
        <div>
            <h2>Notes</h2>
            {notes.map((note) => (
                <Note 
                    note={note} 
                    onDelete={deleteNote} 
                    onEdit={startEditing} 
                    key={note.id} 
                />
            ))}

            <h2>{editNote ? "Update Note" : "Create a Note"}</h2>
            <form onSubmit={editNote ? updateNote : createNote}>
                <label htmlFor="title">Title:</label>
                <br />
                <input
                    type="text"
                    id="title"
                    name="title"
                    required
                    onChange={(e) => setTitle(e.target.value)}
                    value={title}
                />
                <label htmlFor="content">Content:</label>
                <br />
                <textarea
                    id="content"
                    name="content"
                    required
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                ></textarea>
                <br />
                <input type="submit" value={editNote ? "Update Note" : "Submit"} />
                {editNote && (
                    <button onClick={() => setEditNote(null)}>Cancel</button>
                )}
            </form>
        </div>
    );
}

export default Home;
