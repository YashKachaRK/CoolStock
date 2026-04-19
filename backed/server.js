const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Global Logger
app.use((req, res, next) => {
  console.log(`🌐 [${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

// routes
app.use("/", require("./routes/itemRoutes"));

app.listen(5000, () => {
  console.log("Server running on port 5000");
});