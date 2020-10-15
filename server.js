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
    fs.readFile(path.join(__dirname, "db/db.json"), "utf8", function(err, data){
        if (err){
            return console.log(err);
        }
        console.log(data);
        return res.json(JSON.parse(data));
    })
  });

app.post("/api/notes", function(req, res) {
    let newNote = (req.body);
    readFileAsync(path.join(__dirname, "db/db.json"), "utf8").then(function(data){
        const notesData = JSON.parse(data);
        notesData.push(newNote);
        return notesData;
    }).then(function(notesData){
        writeFileAsync(path.join(__dirname, "db/db.json"), JSON.stringify(notesData));
        return res.json(notesData);
    })
});

// Will display the notes.html page
app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "public/notes.html"));
  });

// Will display the index.html page
app.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "public/index.html"));
});

// Starts the server to begin listening
// =============================================================
app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});
