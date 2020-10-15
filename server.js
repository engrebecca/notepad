// Dependencies
// =============================================================
var express = require("express");
var path = require("path");
var fs = require("fs");

// Sets up the Express App
// =============================================================
var app = express();
var PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
// =============================================================
// Will display the notes.html page
app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "public/notes.html"));
  });

// Will display the index.html page
app.get("/*", function(req, res) {
res.sendFile(path.join(__dirname, "public/index.html"));
});

// Will return all saved notes from database
app.get("/api/notes", function(req, res) {
    fs.readFile(path.join(__dirname, "db/db.json"), "utf8", function(err, data){
        if (err){
            return console.log(err);
        }
        console.log(data);
        return res.json(data);
    })
  });

app.post("/api/notes", function(req, res) {
    let newNote = req.body;

    console.log(newNote);

    fs.writefile(path.join(__dirname, "db/db.json"), newNote);

    res.json(newNote);
    });

// Starts the server to begin listening
// =============================================================
app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});
