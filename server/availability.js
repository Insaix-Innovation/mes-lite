const express = require("express");
const router = express.Router();
const pool = require("./db");


router.get("/getMachineIdOptions", async (req, res) =>{
	try {
		const result = await pool.query(
			"SELECT machine_id FROM oee_metrics ORDER BY machine_id"
		);
		const machineIds = result.rows.map(row => row.machine_id);
		res.json(machineIds);
	} catch (error) {
		console.error("Error executing query:", error);
		res.status(500).json({ error: "An internal server error occurred" });
	}
});

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
		const parameter = [req.query.startTime, req.query.endTime];
		const machineIdQuery = "AND machine_id = $3";
		const machineId = req.query.machineId;
		if (machineId) {
			parameter.push(machineId);
		}
		const result = await pool.query(
			`
			SELECT timestamp, AVG(availability) as availability
			FROM oee_calculated
			WHERE timestamp >= $1::timestamp
			  AND timestamp <= $2::timestamp
			  ${machineId ? machineIdQuery : ""}
			GROUP BY timestamp
			ORDER BY timestamp ASC
			`,
			parameter
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
                AVG(o.availability) AS "Availability"
            FROM 
                oee_calculated o
            LEFT JOIN 
                machine_status m ON o.machine_id = m.machine_id
            WHERE 
                ${queryConditions}
            GROUP BY 
                o.machine_id, o.timestamp
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

router.get("/getOvertimeFlag", async (req, res) => {
	try {
		const result = await pool.query(
			"SELECT timestamp, overtime_flag FROM aggregation_flag"
		);
		res.json(result.rows);
	} catch (error) {
		console.error("Error executing query:", error);
		res.status(500).json({ error: "An internal server error occurred" });
	}
});

router.get("/getJobOrder", async (req, res) => {
	try {
		const { startTime, endTime, machineId } = req.query;
		let parameter = [startTime, endTime];
		const query = `SELECT job_order.* 
		FROM job_order
		JOIN oee_metrics ON job_order.job_order_no = oee_metrics.job_order_no
		WHERE job_order.job_start_time >= $1
		AND job_order.job_end_time <= $2
		${machineId ? " AND oee_metrics.machine_id = $3 " : ""}`;

		if (machineId) {
			parameter.push(machineId);
		}
		const result = await pool.query(query, parameter);

		res.json(result.rows);
	} catch (error) {
		console.error("Error executing query:", error);
		res.status(500).json({ error: "An internal server error occurred" });
	}
});

router.put("/updateJobOrder", async (req, res) => {
	try {
		const {
			job_order_no,
			planned_output,
			planned_duration_hrs,
			planned_uph,
		} = req.body;

		if (planned_output != null) {
			const query = `UPDATE job_order set planned_output = $1 where job_order_no = $2`;
			await pool.query(query, [planned_output, job_order_no]);
		} else if (planned_duration_hrs != null) {
			const query = `UPDATE job_order set planned_duration_hrs = $1 where job_order_no = $2`;
			await pool.query(query, [planned_duration_hrs, job_order_no]);
		} else if (planned_uph != null) {
			const query = `UPDATE job_order set planned_uph = $1 where job_order_no = $2`;
			await pool.query(query, [planned_uph, job_order_no]);
		}
		res.json({ success: true });
	} catch (error) {
		console.error("Error updating job_order:", error);
		res.status(500).json({ error: "An internal server error occurred" });
	}
});

router.get("/getMachineStatusBarChart", async (req, res) => {
	try {
		const { startTime, endTime, machineId } = req.query;
		let parameter = [startTime, endTime, machineId];
		const query = `SELECT * FROM machine_status 
		WHERE 
			status_start_time >= $1
			AND status_end_time <= $2
			AND machine_id = $3
		ORDER BY status_start_time
		`;

		const result = await pool.query(query, parameter);

		res.json(result.rows);
	} catch (error) {
		console.error("Error executing query:", error);
		res.status(500).json({ error: "An internal server error occurred" });
	}
});

module.exports = router;
