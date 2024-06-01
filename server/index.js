const express = require("express");
const testRoutes = require("./test");
const summary = require("./summary");
const machine = require("./machine");

const app = express();

// Middleware
app.use(express.json());
app.use(require("cors")());

// Use routes from test.js
app.use(testRoutes);
app.use(summary);
app.use(machine);

app.listen(5000, () => {
  console.log("server has started on port 5000");
});
