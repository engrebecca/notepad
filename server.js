// Dependencies
// =============================================================
const express = require("express");
const path = require("path");
const fs = require("fs");
const util = require("util");

const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);


// Sets up the Express App
// =============================================================
const app = express();
const PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
// ============================================================
// Will return all saved notes from database
app.get("/api/notes", function(req, res) {
    fs.readFile(path.join(__dirname, "db/db.json"), "utf8", (err, data) => {
        if (err){
            return console.log(err);
        }
        return res.json(JSON.parse(data));
    })
  });

// Will add new note to database
app.post("/api/notes", (req, res) => {
    let newNote = (req.body);
    newNote.id = newNote.title.replace(/\s+/g, "").toLowerCase();
    readFileAsync(path.join(__dirname, "db/db.json"), "utf8").then(data => {
        const notesData = JSON.parse(data);
        notesData.push(newNote);
        return notesData;
    }).then(notesData => {
        writeFileAsync(path.join(__dirname, "db/db.json"), JSON.stringify(notesData));
        return res.json(notesData);
    })
});

// Will delete a note from the database
app.delete("/api/notes/:id", (req, res) => {
    let chosen = req.params.id;
    readFileAsync(path.join(__dirname, "db/db.json"),"utf8").then(data => {
        const notesData = JSON.parse(data);
        const remainingNotes = notesData.filter(note => note.id != chosen);
        return remainingNotes;
    }).then(remainingNotes => {
        writeFileAsync(path.join(__dirname, "db/db.json"), JSON.stringify(remainingNotes));
        return res.json(remainingNotes);
    })
});

// Will display the notes.html page
app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "public/notes.html"));
  });

// Will display the index.html page
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "public/index.html"));
});

// Starts the server to begin listening
// =============================================================
app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});
