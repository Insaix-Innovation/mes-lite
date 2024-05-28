const express = require("express");
const testRoutes = require("./test");

const app = express();

// Middleware
app.use(express.json());
app.use(require("cors")());

// Use routes from test.js
app.use(testRoutes);

app.listen(5000, () => {
  console.log("server has started on port 5000");
});

// const express = require('express');
// const cors = require('cors');
// const knex = require('knex');
// require('dotenv').config();
// const db = knex({
//     client: 'pg',
//     connection: {
//         host: process.env.DATABASE_HOST,
//         user: process.env.DATABASE_USERNAME,
//         password: process.env.DATABASE_PASSWORD,
//         database: process.env.DATABASE,
//     },
// });
// const app = express();
// app.use(express.urlencoded({ extended: false }));
// app.use(express.json());
// app.use(cors());
// app.get('/', (req, res) => {
//     db.select('*')
//         .from('job_order')
//         .then((data) => {
//             console.log(data);
//             res.json(data);
//         })
//         .catch((err) => {
//             console.log(err);
//         });
// });
// const port = process.env.PORT || 5000;
// app.listen(port, () => console.log(`Server running on port ${port}, http://localhost:${port}`));