const express = require("express");
const router = express.Router();
const pool = require("./db");

router.get("/getOverallRunTime", async (req, res) => {
	try {
		const query = `SELECT SUM(duration_minutes) AS overall_run_time
        FROM machine_status
        WHERE machine_status = 3
          AND status_start_time >= $1
          AND status_end_time <= $2
          AND machine_id = $3;
      `;
		const values = [
			req.query.startTime,
			req.query.endTime,
			req.query.machineId,
		];
		const { rows } = await pool.query(query, values);
		res.json(rows[0]);
	} catch (error) {
		console.error("Error executing PostgreSQL query:", error);
		res.status(500).json({ error: "An internal server error occurred" });
	}
});

router.get("/getOverallPerformance", async (req, res) => {
	try {
		const query = `SELECT AVG(performance) AS overall_performance
        FROM oee_calculated
        WHERE timestamp >= $1::date
          AND timestamp <= $2::date
          AND machine_id = $3;
      `;
		const values = [
			req.query.startTime,
			req.query.endTime,
			req.query.machineId,
		];
		const { rows } = await pool.query(query, values);
		res.json(rows[0]);
	} catch (error) {
		console.error("Error executing PostgreSQL query:", error);
		res.status(500).json({ error: "An internal server error occurred" });
	}
});

router.get("/performanceBarChart", async (req, res) => {
	try {
		const result = await pool.query(
			`
			SELECT timestamp, performance
			FROM oee_calculated
			WHERE timestamp >= $1::date
			  AND timestamp <= $2::date
              AND machine_id = $3
			ORDER BY timestamp ASC
			`,
			[req.query.startTime, req.query.endTime, req.query.machineId]
		);
		res.json(result.rows);
	} catch (error) {
		console.error("Error executing query:", error);
		res.status(500).json({ error: "An internal server error occurred" });
	}
});

router.get("/performanceDoughnutChart", async (req, res) => {
	try {
		const result = await pool.query(
			`
			SELECT machine_id, timestamp, AVG(performance) as performance
			FROM oee_calculated
			WHERE timestamp >= $1::date
			  AND timestamp <= $2::date
              AND (machine_id = $3 OR $3 IS NULL)
			GROUP BY machine_id, timestamp
			`,
			[req.query.startTime, req.query.endTime, req.query.machineId]
		);
		res.json(result.rows);
	} catch (error) {
		console.error("Error executing query:", error);
		res.status(500).json({ error: "An internal server error occurred" });
	}
});

router.get("/performanceSummary", async (req, res) => {
	try {

		// less target
		const parameter = [
			req.query.startTime,
			req.query.endTime,
			req.query.machineId,
		];
		const result = await pool.query(
			`
			SELECT o.machine_id, MAX(o.timestamp) as timestamp,
			SUM (ma.output_qty/ma.duration_minutes) AS cycle_time,
			SUM (ma.output_qty) AS sum_output_qty,
			SUM (ma.duration_minutes) AS run_time,
			AVG (o.performance) as performance
			FROM oee_calculated o
			LEFT JOIN machine_status ma
			ON o.machine_id = ma.machine_id
			WHERE 	
				ma.status_start_time >= $1 
				AND ma.status_end_time <= $2
				AND ma.machine_status = '3'
				${parameter[2] ? "AND o.machine_id = $3" : ""}
			GROUP BY o.machine_id, o.timestamp, DATE_TRUNC('day', ma.status_start_time)
			`, parameter[2] ? parameter : [parameter[0], parameter[1]]
		);
		res.json(result.rows);
	} catch (error) {
		console.error("Error executing query:", error);
		res.status(500).json({ error: "An internal server error occurred" });
	}
});

module.exports = router;
