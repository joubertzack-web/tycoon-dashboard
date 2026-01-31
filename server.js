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

// JSON file path
const FEEDBACK_PATH = path.join(__dirname, "data", "feedback.json");
const FEEDBACK_DIR = path.dirname(FEEDBACK_PATH);

// Ensure /data folder exists
if (!fs.existsSync(FEEDBACK_DIR)) {
    fs.mkdirSync(FEEDBACK_DIR, { recursive: true });
}

// Ensure feedback.json exists
if (!fs.existsSync(FEEDBACK_PATH)) {
    fs.writeFileSync(FEEDBACK_PATH, "[]");
}

// Load feedback from JSON
function loadFeedback() {
    try {
        const raw = fs.readFileSync(FEEDBACK_PATH, "utf8");
        return JSON.parse(raw);
    } catch (err) {
        console.error("Failed to load feedback.json:", err);
        return [];
    }
}

// Save feedback to JSON
function saveFeedback(data) {
    try {
        fs.writeFileSync(FEEDBACK_PATH, JSON.stringify(data, null, 2));
    } catch (err) {
        console.error("Failed to save feedback.json:", err);
    }
}

// Load logs into memory
let logs = loadFeedback();

// Prevent duplicates
function entryExists(entry) {
    return logs.some(e =>
        e.UserId === entry.UserId &&
        e.Text === entry.Text &&
        e.Timestamp === entry.Timestamp
    );
}

// Receive logs from Roblox
app.post("/api/logs", (req, res) => {
    const { apiKey, data } = req.body;

    if (apiKey !== API_KEY) {
        return res.status(403).json({ error: "Invalid API key" });
    }

    if (!data) {
        return res.status(400).json({ error: "Missing data" });
    }

    // Skip duplicates
    if (entryExists(data)) {
        return res.json({ success: true, skipped: true });
    }

    logs.unshift(data);
    if (logs.length > 500) logs.pop();

    saveFeedback(logs);

    res.json({ success: true });
});

// Serve logs to dashboard
app.get("/api/logs", (req, res) => {
    res.json(logs);
});

// Delete a log entry by index
app.delete("/api/logs/:index", (req, res) => {
    const index = Number(req.params.index);

    if (Number.isNaN(index) || index < 0 || index >= logs.length) {
        return res.status(400).json({ error: "Invalid index" });
    }

    logs.splice(index, 1);
    saveFeedback(logs);

    res.json({ success: true });
});

// Serve static dashboard files
app.use(express.static("public"));

const PORT = process.env.PORT || 3000;
console.log("RAILWAY PORT:", process.env.PORT);

app.listen(PORT, () => console.log(`Dashboard API running on port ${PORT}`));
