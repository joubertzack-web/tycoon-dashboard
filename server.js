const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express(); // MUST come first

app.use(cors());
app.use(bodyParser.json());

// Root route so Railway health checks pass
app.get("/", (req, res) => {
    res.send("Tycoon Dashboard Running");
});

const API_KEY = process.env.API_KEY || "DEV_KEY";

let logs = [];

// Receive logs from Roblox
app.post("/api/logs", (req, res) => {
    const { apiKey, data } = req.body;

    if (apiKey !== API_KEY) {
        return res.status(403).json({ error: "Invalid API key" });
    }

    if (!data) {
        return res.status(400).json({ error: "Missing data" });
    }

    logs.unshift(data);
    if (logs.length > 500) logs.pop();

    res.json({ success: true });
});

// Serve logs to dashboard
app.get("/api/logs", (req, res) => {
    res.json(logs);
});

// Serve static dashboard files
app.use(express.static("public"));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Dashboard API running on port ${PORT}`));

