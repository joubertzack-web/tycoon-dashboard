self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", () => self.clients.claim());
app.get("/service-worker.js", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "service-worker.js"));
});
