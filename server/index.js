const availability = require("./availability.js");
const performance = require("./performance.js");
const express = require("express");
const testRoutes = require("./test");
const summary = require("./summary.js");
const machine = require("./machine.js");

const app = express();

// Middleware
app.use(express.json());
app.use(require("cors")());

// Use routes from test.js
app.use(testRoutes);
app.use(summary);
app.use(machine);
app.use(availability);
app.use(performance);

app.listen(5000, () => {
	console.log("server has started on port 5000");
});
