const express = require("express");
const router = express.Router();
const pool = require("./db");

router.get("/getData", async (req, res) => {
  try {
    console.log("Received request for /getData");
    const test = await pool.query("SELECT * FROM public.job_order");
    console.log("Query executed successfully");
    console.log(test.rows); 
    res.json(test.rows);
  } catch (err) {
    console.error("Error executing query:", err.message);
    res.status(500).send("Server Error");
  }
});

router.get("/gethi", (req, res) => {
  console.log("Received request for /gethi");
  res.send("Hello World");
  console.log(pool);
});

module.exports = router;
