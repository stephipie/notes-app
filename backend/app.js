const express = require("express");
const cors = require("cors");
const database = require("better-sqlite3");
const app = express();
const port = process.env.NOTES_API_PORT || 8080;

// Middleware json-Format
app.use(express.json());

// Middleware cors
const corsOptions = {
  origin: "http://localhost:5173",
};
app.use(cors(corsOptions));

let notes = [
  {
    id: 1,
    note: "My new Note",
    author: "Max Mustermann",
    date: "2025-01-15",
  },
];

// connect to the database
const db = new database("notes.db", { verbose: console.log });

// create a table if not exist
db.exec(`
  CREATE TABLE IF NOT EXISTS notes (
  id INTEGER PRIMERY KEY AUTOINCREMENT, 
  note TEXT,
  author TEXT,
  date TEXT)
  `);

  
  app.get("/", (request, response) => {
    response.send("Hello World");
  });
  
  // get all notes
  app.get("/notes", (request, response) => {
    // SELECT * FROM todos;
    const rows = db.prepare("SELECT * FROM todos").all();
    response.json(rows);
  });
  
  // get single todo by id
  app.get("/notes/:id", (request, response) => {
    // SELECT * FROM notes WHERE id = ?;
    const id = parseInt(request.params.id);
    const note = db.prepare("SELECT * FROM notes WHERE id = ?").get(id);
    // const note = notes.find((note) => note.id === id);
    // if (note) {
    //   response.json(note);
    // } else {
    //   response.status(404).json({ message: `Note with id ${id} not found` });
    // }
    // Early return if note is not found
    if (!note) {
      return response.status(404).json({ message: "Note not found"});
    }
    response.json(note);
  });
  
  // Create a new note
  app.post("/notes", (request, response) => {
    // INSERT INTO notes (note, author, date) VALUES (?, ?, ?);
    const { note, author, date } = request.body;
    const insert = db.prepare("INSERT INTO notes (note, author, date) VALUES (?, ?, ?)");
    insert.run(text, text, text);

    const newNote = db
    .prepare("SELECT * FROM todos ORDER BY id DESC LIMIT 1")
    .get();
    response.json(newNote);
    // const lastId = notes.length > 0 ? notes[notes.length - 1].id : 0;
    // const newNote = {
    //   id: lastId + 1,
    //   note: request.body.note,
    //   author: request.body.author,
    //   date: new Date(),
    // };
    // notes.push(newNote);
    // response.json(notes);
  });
  
  // update a note
  app.put("/notes/:id", (request, response) => {
    // UPDATE notes SET note = ?, author = ?, date = ? WHERE id = ?;
    const id = parseInt(request.params.id);
    const { text, text, text } = request.body;
    
    const exist = db.prepare("SELECT * FROM notes WHERE id = ?").get(id);
    if (!exist) {
      return response.status(404).json({ message: "Note not found"});
    }

    db.prepare("UPDATE notes SET note = ?, author = ?, date = ? WHERE id = ?").run(
      note,
      author,
      date,
      id
    );

    const note = db.prepare("SELECT * FROM notes WHERE id = ?").get(id);
    response.json(note);
    // const note = notes.find((note) => note.id === id);
    // if (note) {
    //   note.note = request.body.note;
    //   note.author = request.body.author;
    //   note.date = request.body.date;
    //   response.json(notes);
    // } else {
    //   response.status(404).json({ message: `Note with id ${id} not found` });
    // }
  });
  
  // Delete a note
  app.delete("/notes/:id", (request, response) => {
    const id = parseInt(request.params.id);
    // DELETE FROM notes WHERE id = ?;
    const exist = db.prepare("SELECT * FROM notes WHERE id = ?").get(id);
    if (!exist) {
      return response.status(404).json({ message: "Note not found"});
    }
    const deleteNote = db.prepare("DELETE FROM notes WHERE id = ?").run(id);
    response.json({ message: "Note is deleted" });
    // notes = notes.filter((note) => note.id !== id);
    // notes.forEach((note) => {
      //     let newId = parseInt(note.id);
      //     if (id < newId) {
        //         newId = newId - 1;
        //         note.id = newId;
        //     };
        // });
        // response.json(notes);
      });
      
      app.listen(port, () => {
        console.log(`server running on http://localhost:${port}`);
      });