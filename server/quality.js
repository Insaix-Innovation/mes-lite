const express = require("express");
const router = express.Router();
const pool = require("./db");
const moment = require("moment");

router.get("/rejectsParetoBarChart", async (req, res) => {
	try {
		const { startTime, endTime, machineId } = req.query;
		const startDateWithTZ = moment(
			`${startTime}`,
			"YYYY-MM-DD HH:mm:ss.SSSSSS+08"
		);
		const endDateWithTZ = moment(
			`${endTime}`,
			"YYYY-MM-DD HH:mm:ss.SSSSSS+08"
		);
		let query = `
        SELECT
        SUM(tester_data.fail_live_no) AS total_fail_live_no,
        SUM(tester_data.fail_neutral_no) AS total_fail_neutral_no,
        SUM(tester_data.fail_earth_no) AS total_fail_earth_no,
        SUM(tester_data.fail_livexneutral_no) AS total_fail_livexneutral_no,
        SUM(tester_data.fail_neutralxearth_no) AS total_fail_neutralxearth_no,
        SUM(tester_data.fail_earthxlive_no) AS total_fail_earthxlive_no,
        SUM(tester_data.short_when_off_no) AS total_short_when_off_no,
        SUM(vision_data.flow_mark_no) AS total_flow_mark_no,
        SUM(vision_data.burr_no) AS total_burr_no,
        SUM(vision_data.colour_uneven_no) AS total_colour_uneven_no,
        SUM(vision_data.colour_no) AS total_colour_no,
        SUM(vision_data.scratches_no) AS total_scratches_no
    FROM 
        tester_data
    JOIN 
        vision_data ON tester_data.job_order_no = vision_data.job_order_no
    JOIN
        oee_metrics ON tester_data.job_order_no = oee_metrics.job_order_no
    JOIN
        job_order ON tester_data.job_order_no = job_order.job_order_no
    WHERE
        job_order.job_start_time >= $1
        AND job_order.job_end_time <= $2
        ${machineId ? " AND oee_metrics.machine_id = $3 " : ""}
				`;
		let values = [startDateWithTZ, endDateWithTZ];
		if (machineId) {
			values.push(machineId);
		}
		const { rows } = await pool.query(query, values);

		res.json(rows);
	} catch (error) {
		console.error("Error executing query:", error);
		res.status(500).json({ error: "An internal server error occurred" });
	}
});

router.get("/qualityDoughnut", async (req, res) => {
	try {
		const { startTime, endTime, machineId } = req.query;
		const query = `
        SELECT 
    (total_good_no + total_pass_no) AS good,
    (total_fail_live_no + total_fail_neutral_no + total_fail_earth_no + 
    total_fail_livexneutral_no + total_fail_neutralxearth_no + 
    total_fail_earthxlive_no + total_short_when_off_no + total_flow_mark_no +
    total_burr_no + total_colour_uneven_no + total_colour_no + total_scratches_no) AS bad
FROM (
    SELECT
        SUM(vision_data.good_no) AS total_good_no,
        SUM(tester_data.pass_no) AS total_pass_no,
        SUM(tester_data.fail_live_no) AS total_fail_live_no,
        SUM(tester_data.fail_neutral_no) AS total_fail_neutral_no,
        SUM(tester_data.fail_earth_no) AS total_fail_earth_no,
        SUM(tester_data.fail_livexneutral_no) AS total_fail_livexneutral_no,
        SUM(tester_data.fail_neutralxearth_no) AS total_fail_neutralxearth_no,
        SUM(tester_data.fail_earthxlive_no) AS total_fail_earthxlive_no,
        SUM(tester_data.short_when_off_no) AS total_short_when_off_no,
        SUM(vision_data.flow_mark_no) AS total_flow_mark_no,
        SUM(vision_data.burr_no) AS total_burr_no,
        SUM(vision_data.colour_uneven_no) AS total_colour_uneven_no,
        SUM(vision_data.colour_no) AS total_colour_no,
        SUM(vision_data.scratches_no) AS total_scratches_no
    FROM 
        tester_data
    JOIN 
        vision_data ON tester_data.job_order_no = vision_data.job_order_no
    JOIN
        oee_metrics ON tester_data.job_order_no = oee_metrics.job_order_no
    JOIN
        job_order ON tester_data.job_order_no = job_order.job_order_no
    WHERE
        job_order.job_start_time >= $1
        AND job_order.job_end_time <= $2
        ${machineId ? "AND oee_metrics.machine_id = $3" : ""}
) AS subquery;

      `;
		const values = [startTime, endTime];
		if (machineId) {
			values.push(machineId);
		}
		const { rows } = await pool.query(query, values);

		res.json(rows);
	} catch (error) {
		console.error("Error executing PostgreSQL query:", error);
		res.status(500).json({ error: "An internal server error occurred" });
	}
});

router.get("/qualitySummary", async (req, res) => {
	try {
		const { startTime, endTime, machineId } = req.query;
		const query = `
        SELECT 
    machine_id,
    job_order_no,
    (total_good_no + total_pass_no) AS good,
    (total_fail_live_no + total_fail_neutral_no + total_fail_earth_no + 
    total_fail_livexneutral_no + total_fail_neutralxearth_no + 
    total_fail_earthxlive_no + total_short_when_off_no + total_flow_mark_no +
    total_burr_no + total_colour_uneven_no + total_colour_no + total_scratches_no) AS bad
FROM (
    SELECT
        oee_metrics.machine_id,
        tester_data.job_order_no,
        SUM(vision_data.good_no) AS total_good_no,
        SUM(tester_data.pass_no) AS total_pass_no,
        SUM(tester_data.fail_live_no) AS total_fail_live_no,
        SUM(tester_data.fail_neutral_no) AS total_fail_neutral_no,
        SUM(tester_data.fail_earth_no) AS total_fail_earth_no,
        SUM(tester_data.fail_livexneutral_no) AS total_fail_livexneutral_no,
        SUM(tester_data.fail_neutralxearth_no) AS total_fail_neutralxearth_no,
        SUM(tester_data.fail_earthxlive_no) AS total_fail_earthxlive_no,
        SUM(tester_data.short_when_off_no) AS total_short_when_off_no,
        SUM(vision_data.flow_mark_no) AS total_flow_mark_no,
        SUM(vision_data.burr_no) AS total_burr_no,
        SUM(vision_data.colour_uneven_no) AS total_colour_uneven_no,
        SUM(vision_data.colour_no) AS total_colour_no,
        SUM(vision_data.scratches_no) AS total_scratches_no
    FROM 
        tester_data
    JOIN 
        vision_data ON tester_data.job_order_no = vision_data.job_order_no
    JOIN
        oee_metrics ON tester_data.job_order_no = oee_metrics.job_order_no
    JOIN
        job_order ON tester_data.job_order_no = job_order.job_order_no
    WHERE
        job_order.job_start_time >= $1
        AND job_order.job_end_time <= $2
        ${machineId ? "AND oee_metrics.machine_id = $3" : ""}
    GROUP BY
        tester_data.job_order_no, vision_data.job_order_no, oee_metrics.machine_id
) AS subquery;

      `;
		const values = [startTime, endTime];
		if (machineId) {
			values.push(machineId);
		}
		const { rows } = await pool.query(query, values);

		const targetOutputMap = {};
		for (let row of rows) {
			const { machine_id } = row;

			// Check if target output for this machine ID already exists in the map
			if (!targetOutputMap[machine_id]) {
				// Retrieve the target output for this machine ID
				const targetOutput = await getOverallTargetOutput(
					startTime,
					endTime,
					machine_id
				);

				// Store the target output in the map
				targetOutputMap[machine_id] = targetOutput;
			}
            row.targetOutput = targetOutputMap[machine_id];

			const query = `SELECT timestamp, quality FROM oee_calculated WHERE machine_id = $1`;
			const qualityResult = await pool.query(query, [machine_id]);
			const qualityrow = qualityResult.rows;
			if (qualityrow.length > 0) {
				row.date = qualityrow[0].timestamp;
				row.quality = qualityrow[0].quality;
			} else {
				row.date = null;
				row.quality = null;
			}

            const queryOutput = `SELECT output_qty FROM machine_status WHERE machine_id = $1`;
			const outputResult = await pool.query(queryOutput, [machine_id]);
			const outputrow = outputResult.rows;
			if (outputrow.length > 0) {
				row.output_qty = outputrow[0].output_qty;
			} else {
				row.output_qty = null;
			}
		}

		res.json(rows);
	} catch (error) {
		console.error("Error executing PostgreSQL query:", error);
		res.status(500).json({ error: "An internal server error occurred" });
	}
});
const getOverallTargetOutput = async (startDate, endDate, machineId) => {
	const defaultValuesQuery = `SELECT operating_hours_start, operating_hours_end FROM default_values`;
	const defaultValuesResult = await pool.query(defaultValuesQuery);
	const operatingHoursStart =
		defaultValuesResult.rows[0].operating_hours_start;
	const operatingHoursEnd = defaultValuesResult.rows[0].operating_hours_end;

	const today = moment().subtract(1, "days").format("YYYY-MM-DD");
	const operatingHoursStartTime = moment(
		`${today} ${operatingHoursStart}`,
		"YYYY-MM-DD HH:mm:ss"
	);
	const operatingHoursEndTime = moment(
		`${today} ${operatingHoursEnd}`,
		"YYYY-MM-DD HH:mm:ss"
	);
	const startDateQuery = moment(
		`${startDate} ${operatingHoursStart}`,
		"YYYY-MM-DD HH:mm:ss"
	);
	const endDateQuery = moment(
		`${endDate} ${operatingHoursEnd}`,
		"YYYY-MM-DD HH:mm:ss"
	);
	console.log(startDate);

	// Get list of jobs planned for the day (for all machines)
	let plannedJobsQuery = `
	SELECT job_order.* 
	FROM job_order
	JOIN oee_metrics ON job_order.job_order_no = oee_metrics.job_order_no
	WHERE 
	job_order.job_start_time BETWEEN $1 AND $2
	AND job_order.job_completion_status = false
	`;

	let queryParams = [
		startDateQuery.format("YYYY-MM-DD HH:mm:ss.SSSSSS+08"),
		endDateQuery.format("YYYY-MM-DD HH:mm:ss.SSSSSS+08"),
	];
	if (machineId) {
		plannedJobsQuery += ` AND oee_metrics.machine_id = $3`;
		queryParams.push(machineId);
	}
	let plannedJobsResult = await pool.query(plannedJobsQuery, queryParams);

	// Initialize planned UPH categories
	let plannedUph1 = 0;
	let plannedUph2 = 0;
	let plannedUph3 = 0;
	let plannedUph4 = 0;

	// Process each job
	for (let job of plannedJobsResult.rows) {
		const jobStartTime = moment(job.job_start_time, "YYYY-MM-DD HH:mm:ss");
		const jobEndTime = jobStartTime
			.clone()
			.add(job.planned_duration_hrs, "hours");
		// console.log(
		// 	"Job Start Time: ",
		// 	jobStartTime.format("YYYY-MM-DD HH:mm:ss")
		// );
		// console.log(
		// 	"Job End Time: ",
		// 	jobEndTime.format("YYYY-MM-DD HH:mm:ss")
		// );

		// Job running for multiple days starting from today
		if (
			jobEndTime.isSameOrAfter(operatingHoursEndTime) &&
			jobStartTime.isSameOrAfter(operatingHoursStartTime)
		) {
			plannedUph1 += job.planned_uph;
			console.log("plannedUph1: ", plannedUph1);
		}
		// Job running for multiple days that started but not completing today
		if (
			jobEndTime.isSameOrAfter(operatingHoursEndTime) &&
			jobStartTime.isBefore(operatingHoursStartTime)
		) {
			plannedUph2 += job.planned_uph;
			console.log("plannedUph2: ", plannedUph2);
		}
		// Job running for multiple days that started and completing today
		if (
			jobEndTime.isSameOrBefore(operatingHoursEndTime) &&
			jobStartTime.isBefore(operatingHoursStartTime)
		) {
			plannedUph3 += job.planned_uph;
			console.log("plannedUph3: ", plannedUph3);
		}
		// Job starting and completing within today's operating hours
		if (
			jobStartTime.isSameOrAfter(operatingHoursStartTime) &&
			jobStartTime.isSameOrBefore(operatingHoursEndTime) &&
			job.job_completion_status
		) {
			plannedUph4 += job.planned_uph;
			console.log("plannedUph4: ", plannedUph4);
		}
	}

	const overallUph = plannedUph1 + plannedUph2 + plannedUph3 + plannedUph4;

	// Calculate current UPH
	let maxOutputQuery = `
		SELECT MAX(total_output_qty) AS max_output
		FROM oee_metrics 
		WHERE timestamp <= $1
	`;
	let minOutputQuery = `
		SELECT MIN(total_output_qty) AS min_output
		FROM oee_metrics 
		WHERE timestamp >= $1
	`;
	let parameterMaxOutputQuery = [
		endDateQuery.format("YYYY-MM-DD HH:mm:ss.SSSSSS+08"),
	];
	let parameterMinOutputQuery = [
		startDateQuery.format("YYYY-MM-DD HH:mm:ss.SSSSSS+08"),
	];
	if (machineId) {
		maxOutputQuery += ` AND machine_id = $2`;
		parameterMaxOutputQuery.push(machineId);
		minOutputQuery += ` AND machine_id = $2`;
		parameterMinOutputQuery.push(machineId);
	}

	const maxOutputResult = await pool.query(
		maxOutputQuery,
		parameterMaxOutputQuery
	);
	const minOutputResult = await pool.query(
		minOutputQuery,
		parameterMinOutputQuery
	);

	const x =
		maxOutputResult.rows[0].max_output - minOutputResult.rows[0].min_output;

	let machineStatusQuery = `
		SELECT SUM(duration_minutes) AS total_duration 
		FROM machine_status 
		WHERE machine_status = 3 
		AND status_start_time >= $1
		AND status_end_time <= $2
	`;
	let parameterMachineStatusQuery = [
		startDateQuery.format("YYYY-MM-DD HH:mm:ss.SSSSSS+08"),
		endDateQuery.format("YYYY-MM-DD HH:mm:ss.SSSSSS+08"),
	];
	if (machineId) {
		machineStatusQuery += `AND machine_id = $3`;
		parameterMachineStatusQuery.push(machineId);
	}
	const machineStatusResult = await pool.query(
		machineStatusQuery,
		parameterMachineStatusQuery
	);
	const y = machineStatusResult.rows[0].total_duration / 60;

	const currentUph = Math.round(x / y);
	const uphPercentage = Math.round((currentUph / overallUph) * 100);
	console.log(x, y);
	return {
		target: overallUph,
		current: currentUph,
		uphPercentageAverage: uphPercentage,
	};
};
module.exports = router;
