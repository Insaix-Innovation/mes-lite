const availability = require("./availability.js");
const performance = require("./performance.js");
const quality = require("./quality.js");
const express = require("express");
const testRoutes = require("./test");
const summary = require("./summary.js");
const machine = require("./machine.js");
const login = require("./login.js");
const authenticateToken = require('./authMiddleware');

const cors = require("cors");
const app = express();

app.use(cors());
// Middleware
app.use(express.json());
app.use(require("cors")());
// Protect routes with authenticateToken
app.use('/admin', authenticateToken);
app.use(testRoutes);
app.use(summary);
app.use(machine);
app.use(availability);
app.use(performance);
app.use(quality);
app.use(login);
app.listen(5000, '0.0.0.0',() => {
	console.log("server has started on port 5000");
});
