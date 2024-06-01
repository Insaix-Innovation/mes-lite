const express = require("express");
const router = express.Router();
const pool = require("./db");

router.get("/availabilityDoughnut", async (req, res) => {
	try {
		const query = `
        SELECT 
        machine_id,
        machine_status,
        SUM(duration_minutes) AS total_duration
      FROM 
        machine_status
      WHERE 
        status_start_time >= $1
        AND status_end_time <= $2
        AND (machine_id = $3 OR $3 IS NULL)
      GROUP BY 
	  machine_id,
        machine_status
      `;
		const values = [
			req.query.startTime,
			req.query.endTime,
			req.query.machineId,
		];
		const { rows } = await pool.query(query, values);
		res.json(rows);
	} catch (error) {
		console.error("Error executing PostgreSQL query:", error);
		res.status(500).json({ error: "An internal server error occurred" });
	}
});

router.get("/getAll", async (req, res) => {
	try {
		const allTodos = await pool.query(
			"SELECT * FROM public.machine_status"
		);
		res.json(allTodos.rows);
	} catch (error) {
		console.error("Error executing query:", error);
		res.status(500).json({ error: "An internal server error occurred" });
	}
});

router.get("/availabilityBarChart", async (req, res) => {
	try {
		const result = await pool.query(
			`
			SELECT timestamp, availability
			FROM oee_calculated
			WHERE timestamp >= $1::timestamp
			  AND timestamp <= $2::timestamp
			ORDER BY timestamp ASC
			`,
			[req.query.startTime, req.query.endTime]
		);
		res.json(result.rows);
	} catch (error) {
		console.error("Error executing query:", error);
		res.status(500).json({ error: "An internal server error occurred" });
	}
});

router.get("/availabilitySummary", async (req, res) => {
	try {
		let queryParams = [
			req.query.startTime,
			req.query.endTime,
			req.query.startTimeTS,
			req.query.endTimeTS,
		];

		let queryConditions = `
            o.timestamp >= $1::timestamp
            AND o.timestamp <= $2::timestamp
            AND (m.status_start_time >= $3 AND m.status_end_time <= $4)
        `;

		if (req.query.machineId) {
			queryConditions += ` AND o.machine_id = $5`;
			queryParams.push(req.query.machineId);
		}

		const result = await pool.query(
			`
            SELECT 
                o.machine_id AS "MachineID",
                o.timestamp AS "Date",
                COALESCE(SUM(CASE WHEN m.machine_status = 3 THEN m.duration_minutes ELSE 0 END), 0) AS "TotalRunningTime",
                COALESCE(SUM(CASE WHEN m.machine_status = 4 THEN m.duration_minutes ELSE 0 END), 0) AS "TotalDownTime",
                o.availability AS "Availability"
            FROM 
                oee_calculated o
            LEFT JOIN 
                machine_status m ON o.machine_id = m.machine_id
            WHERE 
                ${queryConditions}
            GROUP BY 
                o.machine_id, o.timestamp, o.availability
            `,
			queryParams
		);
		res.json(result.rows);
	} catch (error) {
		console.error("Error executing query:", error);
		res.status(500).json({ error: "An internal server error occurred" });
	}
});

router.post("/updateOvertimeFlag", async (req, res) => {
	try {
		const { timestamp, overtimeFlag } = req.body;
		console.log(timestamp, overtimeFlag);
		// const currentTime = new Date();
		// const isAllowed = currentTime.getHours() < 17
		//     ? new Date(timestamp) >= currentTime
		//     : new Date(timestamp) > currentTime;

		// if (!isAllowed) {
		//     return res.status(400).json({ error: "You are not allowed to update past dates or dates after 17:00." });
		// }

		const query = `
		DO $$ 
    DECLARE
        p_date DATE := '${timestamp}'::DATE;
        p_overtime_flag BOOLEAN := '${overtimeFlag}';
    BEGIN
        IF EXISTS (SELECT 1 FROM aggregation_flag WHERE DATE(timestamp) = p_date) THEN
            UPDATE aggregation_flag SET overtime_flag = p_overtime_flag WHERE DATE(timestamp) = p_date;
        ELSE
            INSERT INTO aggregation_flag (timestamp, overtime_flag) VALUES ('${timestamp}', p_overtime_flag);
        END IF;
    END $$;
    `;
		await pool.query(query);

		res.json({ success: true });
	} catch (error) {
		console.error("Error updating overtime flag:", error);
		res.status(500).json({ error: "An internal server error occurred" });
	}
});

router.get("/getToggledDates", async (req, res) => {
	try {
		const result = await pool.query(
			"SELECT timestamp FROM aggregation_flag"
		);
		res.json(result.rows);
	} catch (error) {
		console.error("Error executing query:", error);
		res.status(500).json({ error: "An internal server error occurred" });
	}
});

router.get("/getJobOrder", async (req, res) => {
	try {
		let parameter = [req.query.startTime, req.query.endTime];
		const query = `SELECT * FROM public.job_order
		WHERE job_start_time >= $1
		AND job_end_time <= $2`;
		const result = await pool.query(query, parameter);

		res.json(result.rows);
	} catch (error) {
		console.error("Error executing query:", error);
		res.status(500).json({ error: "An internal server error occurred" });
	}
});

router.put("/updateJobOrder", async (req, res) => {
	try {
		const { job_order_no, planned_output, planned_duration_hrs, planned_uph } = req.body;

		if(planned_output != null){
			const query = `UPDATE job_order set planned_output = $1 where job_order_no = $2`;
			await pool.query(query, [planned_output, job_order_no]);
		} else if(planned_duration_hrs != null){
			const query = `UPDATE job_order set planned_duration_hrs = $1 where job_order_no = $2`;
			await pool.query(query, [planned_duration_hrs, job_order_no]);
		} else if(planned_uph != null){
			const query = `UPDATE job_order set planned_uph = $1 where job_order_no = $2`;
			await pool.query(query, [planned_uph, job_order_no]);
		}
		res.json({ success: true });
	} catch (error) {
		console.error("Error updating job_order:", error);
		res.status(500).json({ error: "An internal server error occurred" });
	}
});

module.exports = router;
