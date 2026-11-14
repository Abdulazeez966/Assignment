require("dotenv").config();
const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Custom middleware to log requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// JSON parsing
app.use(express.json());

// Serve static files from /public
app.use(express.static(path.join(__dirname, "public"), { index: false }));

// GET / "My Week 2 API!" for API clients (curl/Postman),
// and the static HTML page for browsers 
app.get("/", (req, res) => {
  if ((req.headers.accept || "").includes("text/html")) {
    return res.sendFile(path.join(__dirname, "public", "index.html"));
  }
  res.send("My Week 2 API!");
});

// Also available explicitly so it can always be tested
app.get("/api", (req, res) => {
  res.send("My Week 2 API!");
});

// POST /user -> accepts { name, email }, responds "Hello, [name]!"
app.post("/user", (req, res) => {
  const { name, email } = req.body || {};
  if (!name || !email) {
    return res.status(400).json({ error: "Both 'name' and 'email' are required." });
  }
  res.send(`Hello, ${name}!`);
});

// GET /user/:id -> "User [id] profile"
app.get("/user/:id", (req, res) => {
  res.send(`User ${req.params.id} profile`);
});

// Handle malformed JSON bodies
app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ error: "Invalid JSON in request body." });
  }
  console.error(err);
  res.status(500).json({ error: "Something went wrong." });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
