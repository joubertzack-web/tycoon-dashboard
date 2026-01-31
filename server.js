const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express(); // MUST come first

// Redirect root to dashboard
app.get("/", (req, res) => {
    res.redirect("/dashboard.html");
});

app.use(cors());
app.use(bodyParser.json());

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
console.log("RAILWAY PORT:", process.env.PORT);
app.listen(PORT, () => console.log(`Dashboard API running on port ${PORT}`));
