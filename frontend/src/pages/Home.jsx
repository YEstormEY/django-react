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
      .catch((err) => alert("Error fetching notes: " + err));
  };

  const deleteNote = (id) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;

    api
      .delete(`/api/notes/delete/${id}/`)
      .then((res) => {
        if (res.status === 204) alert("Note deleted successfully!");
        getNotes();
      })
      .catch((error) => alert("Error deleting note: " + error));
  };

  const createNote = (e) => {
    e.preventDefault();
    api
      .post("/api/notes/", { content, title })
      .then((res) => {
        if (res.status === 201) alert("Note created successfully!");
        resetForm();
        getNotes();
      })
      .catch((err) => alert("Error creating note: " + err));
  };

  const startEditing = (note) => {
    setEditNote(note);
    setTitle(note.title);
    setContent(note.content);
  };

  const cancelEditing = () => {
    resetForm();
  };

  const updateNote = (e) => {
    e.preventDefault();
    if (!editNote) return;

    api
      .put(`/api/notes/update/${editNote.id}/`, { content, title })
      .then((res) => {
        if (res.status === 200) alert("Note updated successfully!");
        resetForm();
        getNotes();
      })
      .catch((err) => alert("Error updating note: " + err));
  };

  const resetForm = () => {
    setEditNote(null);
    setTitle("");
    setContent("");
  };

  return (
    <div className="container">
      {/* Welcome Section */}
      <header className="header">
        <h1>📒 Note Planner</h1>
        <p>
          Organize your thoughts, keep track of important tasks, and never miss
          a note again! Create, edit, and manage your notes with ease.
        </p>
      </header>

      {/* Notes Grid */}
      <section className="notes-section">
        <h2>Your Notes</h2>
        {notes.length === 0 ? (
          <p className="empty-message">No notes found. Start by adding one!</p>
        ) : (
          <div className="notes-grid">
            {notes.map((note) => (
              <Note
                note={note}
                onDelete={deleteNote}
                onEdit={startEditing}
                key={note.id}
              />
            ))}
          </div>
        )}
      </section>

      {/* Note Form */}
      <section className="form-section">
        <h2>{editNote ? "Edit Note" : "Create a New Note"}</h2>
        <form onSubmit={editNote ? updateNote : createNote}>
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            required
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            placeholder="Enter note title"
          />

          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            name="content"
            required
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your note here..."
          ></textarea>

          <div className="form-buttons">
            <input type="submit" value={editNote ? "Update Note" : "Add Note"} />
            {editNote && (
              <button className="cancel-button" onClick={cancelEditing}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>
    </div>
  );
}

export default Home;
