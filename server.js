const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

const app = express();

// Redirect root to dashboard
app.get("/", (req, res) => {
    res.redirect("/dashboard.html");
});

app.use(cors());
app.use(bodyParser.json());

const API_KEY = process.env.API_KEY || "DEV_KEY";

// ===============================
// PERSISTENT STORAGE (/data)
// ===============================

const DATA_DIR = "/data";

if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

const FEEDBACK_PATH = path.join(DATA_DIR, "feedback.json");
const NOTES_PATH = path.join(DATA_DIR, "adminNotes.json");

// Ensure files exist
if (!fs.existsSync(FEEDBACK_PATH)) fs.writeFileSync(FEEDBACK_PATH, "[]");
if (!fs.existsSync(NOTES_PATH)) fs.writeFileSync(NOTES_PATH, JSON.stringify({ notes: [] }, null, 2));

// ===============================
// FEEDBACK LOGS
// ===============================

function loadFeedback() {
    try {
        return JSON.parse(fs.readFileSync(FEEDBACK_PATH, "utf8"));
    } catch {
        return [];
    }
}

function saveFeedback(data) {
    fs.writeFileSync(FEEDBACK_PATH, JSON.stringify(data, null, 2));
}

let logs = loadFeedback();

function entryExists(entry) {
    return logs.some(e =>
        e.UserId === entry.UserId &&
        e.Text === entry.Text &&
        e.Timestamp === entry.Timestamp
    );
}

app.post("/api/logs", (req, res) => {
    const { apiKey, data } = req.body;

    if (apiKey !== API_KEY) {
        return res.status(403).json({ error: "Invalid API key" });
    }

    if (!data) {
        return res.status(400).json({ error: "Missing data" });
    }

    if (entryExists(data)) {
        return res.json({ success: true, skipped: true });
    }

    logs.unshift(data);
    if (logs.length > 500) logs.pop();

    saveFeedback(logs);

    res.json({ success: true });
});

app.get("/api/logs", (req, res) => {
    res.json(logs);
});

app.delete("/api/logs/:index", (req, res) => {
    const index = Number(req.params.index);

    if (Number.isNaN(index) || index < 0 || index >= logs.length) {
        return res.status(400).json({ error: "Invalid index" });
    }

    logs.splice(index, 1);
    saveFeedback(logs);

    res.json({ success: true });
});

app.get("/api/logs/ids", (req, res) => {
    const ids = logs.map(entry => entry.UniqueId);
    res.json({ ids });
});

// ===============================
// ADMIN NOTES
// ===============================

function loadNotes() {
    try {
        return JSON.parse(fs.readFileSync(NOTES_PATH, "utf8")).notes || [];
    } catch {
        return [];
    }
}

function saveNotes(notes) {
    fs.writeFileSync(NOTES_PATH, JSON.stringify({ notes }, null, 2));
}

app.get("/api/notes", (req, res) => {
    res.json({ notes: loadNotes() });
});

app.post("/api/notes", (req, res) => {
    const { text } = req.body;

    if (!text || typeof text !== "string") {
        return res.status(400).json({ error: "Invalid note" });
    }

    const notes = loadNotes();
    notes.unshift({
        text,
        timestamp: Math.floor(Date.now() / 1000)
    });

    saveNotes(notes);
    res.json({ success: true });
});

app.delete("/api/notes/:index", (req, res) => {
    const index = Number(req.params.index);
    const notes = loadNotes();

    if (Number.isNaN(index) || index < 0 || index >= notes.length) {
        return res.status(400).json({ error: "Invalid index" });
    }

    notes.splice(index, 1);
    saveNotes(notes);

    res.json({ success: true });
});

// ===============================
// STATIC FILES
// ===============================

app.use(express.static("public"));

const PORT = process.env.PORT || 3000;
console.log("REAL FEEDBACK PATH:", FEEDBACK_PATH);
console.log("REAL NOTES PATH:", NOTES_PATH);

app.listen(PORT, () => console.log(`Dashboard API running on port ${PORT}`));
