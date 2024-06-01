const express = require("express");
const router = express.Router();
const pool = require("./db");
const moment = require('moment');


router.get("/getMachine", async (req, res) => {
    try {
        console.log("Received request for /getMachine");
        const test = await pool.query("SELECT * FROM public.machine_live_data");
        res.json(test.rows);
    } catch (err) {
        console.error("Error executing query:", err.message);
        res.status(500).send("Server Error");
    }
});

// router.get("/getMachineLive", async (req, res) => {
//     try {
//         console.log("Received request for /getMachine");
//         const query = `
//             SELECT 
//                 (SELECT (job_order_no) FROM public.machine_live_data WHERE machine_id = 'M01' AND baseline = false) -
//                 (SELECT (job_order_no) FROM public.machine_live_data WHERE machine_id = 'M01' AND baseline = true) 
//             AS job_order_difference,
//             (SELECT (machine_uptime_hr) FROM public.machine_live_data WHERE machine_id = 'M01' AND baseline = false) -
//                 (SELECT (machine_uptime_hr) FROM public.machine_live_data WHERE machine_id = 'M01' AND baseline = true) 
//             AS machine_uptime_difference,
//             (SELECT (machine_uptime_hr) FROM public.machine_live_data WHERE machine_id = 'M01' AND baseline = false) -
//                 (SELECT (machine_uptime_hr) FROM public.machine_live_data WHERE machine_id = 'M01' AND baseline = true) 
//             AS machine_uptime_difference,
//             (SELECT (machine_downtime_hr) FROM public.machine_live_data WHERE machine_id = 'M01' AND baseline = false) -
//                 (SELECT (machine_downtime_hr) FROM public.machine_live_data WHERE machine_id = 'M01' AND baseline = true) 
//             AS machine_downtime_difference,
//             (SELECT (total_output_qty) FROM public.machine_live_data WHERE machine_id = 'M01' AND baseline = false) -
//                 (SELECT (total_output_qty) FROM public.machine_live_data WHERE machine_id = 'M01' AND baseline = true) 
//             AS total_output_qty_difference,
//             (SELECT (total_reject_qty) FROM public.machine_live_data WHERE machine_id = 'M01' AND baseline = false) -
//                 (SELECT (total_reject_qty) FROM public.machine_live_data WHERE machine_id = 'M01' AND baseline = true) 
//             AS total_reject_qty_difference,
//             (SELECT (machine_status) FROM public.machine_live_data WHERE machine_id = 'M01' AND baseline = false) -
//                 (SELECT (machine_status) FROM public.machine_live_data WHERE machine_id = 'M01' AND baseline = true) 
//             AS machine_status_difference`;

//         const result = await pool.query(query);
//         const jobOrderDifference = result.rows[0].job_order_difference;
//         const machineUptimeDifference = result.rows[0].machine_uptime_difference;
//         const machineDowntimeDifference = result.rows[0].machine_downtime_difference;
//         const totalOutputQtyDifference = result.rows[0].total_output_qty_difference;
//         const totalRejectQtyDifference = result.rows[0].total_reject_qty_difference;
//         const machineStatusDifference = result.rows[0].machine_status_difference;

//         res.json({
//             jobOrder: jobOrderDifference,
//             machineUptime: machineUptimeDifference,
//             machineDowntime: machineDowntimeDifference,
//             totalOutputQty: totalOutputQtyDifference,
//             totalRejectQty: totalRejectQtyDifference,
//             machineStatus: machineStatusDifference
//         });
//     } catch (err) {
//         console.error("Error executing query:", err.message);
//         res.status(500).send("Server Error");
//     }
// });

router.get("/getMachineLive", async (req, res) => {
    try {
        console.log("Received request for /getMachineLive");
        const machineId = req.query.machineId;
        if (!machineId) {
            return res.status(400).send("machineId is required");
        }

        const query = `
            SELECT 
                (SELECT job_order_no FROM public.machine_live_data WHERE machine_id = $1 AND baseline = false) -
                (SELECT job_order_no FROM public.machine_live_data WHERE machine_id = $1 AND baseline = true) 
            AS job_order_difference,
            (SELECT machine_uptime_hr FROM public.machine_live_data WHERE machine_id = $1 AND baseline = false) -
                (SELECT machine_uptime_hr FROM public.machine_live_data WHERE machine_id = $1 AND baseline = true) 
            AS machine_uptime_difference,
            (SELECT machine_downtime_hr FROM public.machine_live_data WHERE machine_id = $1 AND baseline = false) -
                (SELECT machine_downtime_hr FROM public.machine_live_data WHERE machine_id = $1 AND baseline = true) 
            AS machine_downtime_difference,
            (SELECT total_output_qty FROM public.machine_live_data WHERE machine_id = $1 AND baseline = false) -
                (SELECT total_output_qty FROM public.machine_live_data WHERE machine_id = $1 AND baseline = true) 
            AS total_output_qty_difference,
            (SELECT total_reject_qty FROM public.machine_live_data WHERE machine_id = $1 AND baseline = false) -
                (SELECT total_reject_qty FROM public.machine_live_data WHERE machine_id = $1 AND baseline = true) 
            AS total_reject_qty_difference,
            (SELECT machine_status FROM public.machine_live_data WHERE machine_id = $1 AND baseline = false) -
                (SELECT machine_status FROM public.machine_live_data WHERE machine_id = $1 AND baseline = true) 
            AS machine_status_difference
        `;

        const result = await pool.query(query, [machineId]);
        const data = result.rows[0];

        res.json({
            jobOrder: data.job_order_difference,
            machineUptime: data.machine_uptime_difference,
            machineDowntime: data.machine_downtime_difference,
            totalOutputQty: data.total_output_qty_difference,
            totalRejectQty: data.total_reject_qty_difference,
            machineStatus: data.machine_status_difference
        });
    } catch (err) {
        console.error("Error executing query:", err.message);
        res.status(500).send("Server Error");
    }
});


// router.get("/getTesterLive", async (req, res) => {
//     try {
//         console.log("Received request for /getTesterLive");

//         const query = `
//             SELECT 
//                 (SELECT pass_no FROM public.tester_live_data WHERE machine_id = 'M01' AND baseline = false) -
//                 (SELECT pass_no FROM public.tester_live_data WHERE machine_id = 'M01' AND baseline = true) 
//                 AS pass_no_difference,

//                 (SELECT fail_live_no FROM public.tester_live_data WHERE machine_id = 'M01' AND baseline = false) -
//                 (SELECT fail_live_no FROM public.tester_live_data WHERE machine_id = 'M01' AND baseline = true) 
//                 AS fail_live_no_difference,

//                 (SELECT fail_neutral_no FROM public.tester_live_data WHERE machine_id = 'M01' AND baseline = false) -
//                 (SELECT fail_neutral_no FROM public.tester_live_data WHERE machine_id = 'M01' AND baseline = true) 
//                 AS fail_neutral_no_difference,

//                 (SELECT fail_earth_no FROM public.tester_live_data WHERE machine_id = 'M01' AND baseline = false) -
//                 (SELECT fail_earth_no FROM public.tester_live_data WHERE machine_id = 'M01' AND baseline = true) 
//                 AS fail_earth_no_difference,

//                 (SELECT fail_livexneutral_no FROM public.tester_live_data WHERE machine_id = 'M01' AND baseline = false) -
//                 (SELECT fail_livexneutral_no FROM public.tester_live_data WHERE machine_id = 'M01' AND baseline = true) 
//                 AS fail_livexneutral_no_difference,

//                 (SELECT fail_neutralxearth_no FROM public.tester_live_data WHERE machine_id = 'M01' AND baseline = false) -
//                 (SELECT fail_neutralxearth_no FROM public.tester_live_data WHERE machine_id = 'M01' AND baseline = true) 
//                 AS fail_neutralxearth_no_difference,

//                 (SELECT fail_earthxlive_no FROM public.tester_live_data WHERE machine_id = 'M01' AND baseline = false) -
//                 (SELECT fail_earthxlive_no FROM public.tester_live_data WHERE machine_id = 'M01' AND baseline = true) 
//                 AS fail_earthxlive_no_difference,

//                 (SELECT short_when_off_no FROM public.tester_live_data WHERE machine_id = 'M01' AND baseline = false) -
//                 (SELECT short_when_off_no FROM public.tester_live_data WHERE machine_id = 'M01' AND baseline = true) 
//                 AS short_when_off_no_difference
//         `;

//         const result = await pool.query(query);
//         const pass = result.rows[0].pass_no_difference;
//         const failLive = result.rows[0].fail_live_no_difference;
//         const failNeutral = result.rows[0].fail_neutral_no_difference;
//         const failEarth = result.rows[0].fail_earth_no_difference;
//         const failLiveNeutral = result.rows[0].fail_livexneutral_no_difference;
//         const failNeutralEarth = result.rows[0].fail_neutralxearth_no_difference;
//         const failEarthLive = result.rows[0].fail_earthxlive_no_difference;
//         const shortWhenOff = result.rows[0].short_when_off_no_difference;

//         res.json({
//             pass, failLive, failNeutral, failEarth, failLiveNeutral, failNeutralEarth, failEarthLive, shortWhenOff
//         });
//     } catch (err) {
//         console.error("Error executing query:", err.message);
//         res.status(500).send("Server Error");
//     }
// });

router.get("/getTesterLive", async (req, res) => {
    try {
        console.log("Received request for /getTesterLive");
        const machineId = req.query.machineId;
        if (!machineId) {
            return res.status(400).send("machineId is required");
        }

        const query = `
            SELECT 
                (SELECT pass_no FROM public.tester_live_data WHERE machine_id = $1 AND baseline = false) -
                (SELECT pass_no FROM public.tester_live_data WHERE machine_id = $1 AND baseline = true) 
                AS pass_no_difference,

                (SELECT fail_live_no FROM public.tester_live_data WHERE machine_id = $1 AND baseline = false) -
                (SELECT fail_live_no FROM public.tester_live_data WHERE machine_id = $1 AND baseline = true) 
                AS fail_live_no_difference,

                (SELECT fail_neutral_no FROM public.tester_live_data WHERE machine_id = $1 AND baseline = false) -
                (SELECT fail_neutral_no FROM public.tester_live_data WHERE machine_id = $1 AND baseline = true) 
                AS fail_neutral_no_difference,

                (SELECT fail_earth_no FROM public.tester_live_data WHERE machine_id = $1 AND baseline = false) -
                (SELECT fail_earth_no FROM public.tester_live_data WHERE machine_id = $1 AND baseline = true) 
                AS fail_earth_no_difference,

                (SELECT fail_livexneutral_no FROM public.tester_live_data WHERE machine_id = $1 AND baseline = false) -
                (SELECT fail_livexneutral_no FROM public.tester_live_data WHERE machine_id = $1 AND baseline = true) 
                AS fail_livexneutral_no_difference,

                (SELECT fail_neutralxearth_no FROM public.tester_live_data WHERE machine_id = $1 AND baseline = false) -
                (SELECT fail_neutralxearth_no FROM public.tester_live_data WHERE machine_id = $1 AND baseline = true) 
                AS fail_neutralxearth_no_difference,

                (SELECT fail_earthxlive_no FROM public.tester_live_data WHERE machine_id = $1 AND baseline = false) -
                (SELECT fail_earthxlive_no FROM public.tester_live_data WHERE machine_id = $1 AND baseline = true) 
                AS fail_earthxlive_no_difference,

                (SELECT short_when_off_no FROM public.tester_live_data WHERE machine_id = $1 AND baseline = false) -
                (SELECT short_when_off_no FROM public.tester_live_data WHERE machine_id = $1 AND baseline = true) 
                AS short_when_off_no_difference
        `;

        const result = await pool.query(query, [machineId]);
        const data = result.rows[0];

        res.json({
            pass: data.pass_no_difference,
            failLive: data.fail_live_no_difference,
            failNeutral: data.fail_neutral_no_difference,
            failEarth: data.fail_earth_no_difference,
            failLiveNeutral: data.fail_livexneutral_no_difference,
            failNeutralEarth: data.fail_neutralxearth_no_difference,
            failEarthLive: data.fail_earthxlive_no_difference,
            shortWhenOff: data.short_when_off_no_difference
        });
    } catch (err) {
        console.error("Error executing query:", err.message);
        res.status(500).send("Server Error");
    }
});


// router.get("/getVisionLive", async (req, res) => {
//     try {
//         console.log("Received request for /getVisionLive");

//         const query = `
//             SELECT 
//                 (SELECT good_no FROM public.vision_live_data WHERE machine_id = 'M01' AND baseline = false) -
//                 (SELECT good_no FROM public.vision_live_data WHERE machine_id = 'M01' AND baseline = true) 
//                 AS good_no_difference,

//                 (SELECT flow_mark_no FROM public.vision_live_data WHERE machine_id = 'M01' AND baseline = false) -
//                 (SELECT flow_mark_no FROM public.vision_live_data WHERE machine_id = 'M01' AND baseline = true) 
//                 AS flow_mark_no_difference,

//                 (SELECT burr_no FROM public.vision_live_data WHERE machine_id = 'M01' AND baseline = false) -
//                 (SELECT burr_no FROM public.vision_live_data WHERE machine_id = 'M01' AND baseline = true) 
//                 AS burr_no_difference,

//                 (SELECT colour_uneven_no FROM public.vision_live_data WHERE machine_id = 'M01' AND baseline = false) -
//                 (SELECT colour_uneven_no FROM public.vision_live_data WHERE machine_id = 'M01' AND baseline = true) 
//                 AS colour_uneven_no_difference,

//                 (SELECT colour_no FROM public.vision_live_data WHERE machine_id = 'M01' AND baseline = false) -
//                 (SELECT colour_no FROM public.vision_live_data WHERE machine_id = 'M01' AND baseline = true) 
//                 AS colour_no_difference,

//                 (SELECT scratches_no FROM public.vision_live_data WHERE machine_id = 'M01' AND baseline = false) -
//                 (SELECT scratches_no FROM public.vision_live_data WHERE machine_id = 'M01' AND baseline = true) 
//                 AS scratches_no_difference
//         `;

//         const result = await pool.query(query);
//         const good = result.rows[0].good_no_difference;
//         const flowmark = result.rows[0].flow_mark_no_difference;
//         const burrno = result.rows[0].burr_no_difference;
//         const coloruneven = result.rows[0].colour_uneven_no_difference;
//         const color = result.rows[0].colour_no_difference;
//         const scratches = result.rows[0].scratches_no_difference;

//         res.json({
//             good, flowmark, burrno, coloruneven, color, scratches});
//     } catch (err) {
//         console.error("Error executing query:", err.message);
//         res.status(500).send("Server Error");
//     }
// });
router.get("/getVisionLive", async (req, res) => {
    try {
        console.log("Received request for /getVisionLive");
        const machineId = req.query.machineId;
        if (!machineId) {
            return res.status(400).send("machineId is required");
        }

        const query = `
            SELECT 
                (SELECT good_no FROM public.vision_live_data WHERE machine_id = $1 AND baseline = false) -
                (SELECT good_no FROM public.vision_live_data WHERE machine_id = $1 AND baseline = true) 
                AS good_no_difference,

                (SELECT flow_mark_no FROM public.vision_live_data WHERE machine_id = $1 AND baseline = false) -
                (SELECT flow_mark_no FROM public.vision_live_data WHERE machine_id = $1 AND baseline = true) 
                AS flow_mark_no_difference,

                (SELECT burr_no FROM public.vision_live_data WHERE machine_id = $1 AND baseline = false) -
                (SELECT burr_no FROM public.vision_live_data WHERE machine_id = $1 AND baseline = true) 
                AS burr_no_difference,

                (SELECT colour_uneven_no FROM public.vision_live_data WHERE machine_id = $1 AND baseline = false) -
                (SELECT colour_uneven_no FROM public.vision_live_data WHERE machine_id = $1 AND baseline = true) 
                AS colour_uneven_no_difference,

                (SELECT colour_no FROM public.vision_live_data WHERE machine_id = $1 AND baseline = false) -
                (SELECT colour_no FROM public.vision_live_data WHERE machine_id = $1 AND baseline = true) 
                AS colour_no_difference,

                (SELECT scratches_no FROM public.vision_live_data WHERE machine_id = $1 AND baseline = false) -
                (SELECT scratches_no FROM public.vision_live_data WHERE machine_id = $1 AND baseline = true) 
                AS scratches_no_difference
        `;

        const result = await pool.query(query, [machineId]);
        const data = result.rows[0];

        res.json({
            good: data.good_no_difference,
            flowmark: data.flow_mark_no_difference,
            burrno: data.burr_no_difference,
            coloruneven: data.colour_uneven_no_difference,
            color: data.colour_no_difference,
            scratches: data.scratches_no_difference
        });
    } catch (err) {
        console.error("Error executing query:", err.message);
        res.status(500).send("Server Error");
    }
});

router.get('/calculateMachineUPHdropDown', async (req, res) => {
    try {
        console.log("Received request for /calculateMachineUPHdropDown");
        const machineId = req.query.machineId;
        if (!machineId) {
            return res.status(400).send("machineId is required");
        }
        // Get operating hours from default_values
        const defaultValuesQuery = `SELECT operating_hours_start, operating_hours_end FROM default_values`;
        const defaultValuesResult = await pool.query(defaultValuesQuery);
        const operatingHoursStart = defaultValuesResult.rows[0].operating_hours_start;
        const operatingHoursEnd = defaultValuesResult.rows[0].operating_hours_end;

        const today = moment().format('YYYY-MM-DD');
        const operatingHoursStartTime = moment(`${today} ${operatingHoursStart}`, 'YYYY-MM-DD HH:mm:ss');
        const operatingHoursEndTime = moment(`${today} ${operatingHoursEnd}`, 'YYYY-MM-DD HH:mm:ss');

        console.log("Operating Hours Start Time: ", operatingHoursStartTime.format('YYYY-MM-DD HH:mm:ss'));
        console.log("Operating Hours End Time: ", operatingHoursEndTime.format('YYYY-MM-DD HH:mm:ss'));

        // Get list of jobs planned for the day (!!no machine_id)
        const plannedJobsQuery = `
            SELECT * FROM job_order 
            WHERE 
            job_start_time BETWEEN $1 AND $2
            AND job_completion_status = false
        `;
        const plannedJobsResult = await pool.query(plannedJobsQuery, [ operatingHoursStartTime.format('YYYY-MM-DD HH:mm:ss'), operatingHoursEndTime.format('YYYY-MM-DD HH:mm:ss')]);
        console.log(plannedJobsResult.rows);

        // Initialize planned UPH categories
        let plannedUph1 = 0;
        let plannedUph2 = 0;
        let plannedUph3 = 0;
        let plannedUph4 = 0;

        // Process each job
        for (let job of plannedJobsResult.rows) {
            const jobStartTime = moment(job.job_start_time, 'YYYY-MM-DD HH:mm:ss');
            const jobEndTime = jobStartTime.clone().add(job.planned_duration_hrs, 'hours');
            console.log("Job Start Time: ", jobStartTime.format('YYYY-MM-DD HH:mm:ss'));
            console.log("Job End Time: ", jobEndTime.format('YYYY-MM-DD HH:mm:ss'));

            // Job running for multiple days starting from today
            if (jobEndTime.isSameOrAfter(operatingHoursEndTime) && jobStartTime.isSameOrAfter(operatingHoursStartTime)) {
                plannedUph1 += job.planned_uph;
                console.log("plannedUph1: ", plannedUph1);
            }
            // Job running for multiple days that started but not completing today
            if (jobEndTime.isSameOrAfter(operatingHoursEndTime) && jobStartTime.isBefore(operatingHoursStartTime)) {
                plannedUph2 += job.planned_uph;
                console.log("plannedUph2: ", plannedUph2);
            }
            // Job running for multiple days that started and completing today
            if (jobEndTime.isSameOrBefore(operatingHoursEndTime) && jobStartTime.isBefore(operatingHoursStartTime)) {
                plannedUph3 += job.planned_uph;
                console.log("plannedUph3: ", plannedUph3);
            }
            // Job starting and completing within today's operating hours
            if (jobStartTime.isSameOrAfter(operatingHoursStartTime) && jobStartTime.isSameOrBefore(operatingHoursEndTime) && job.job_completion_status) {
                plannedUph4 += job.planned_uph;
                console.log("plannedUph4: ", plannedUph4);
            }
        }

        const overallUph = plannedUph1 + plannedUph2 + plannedUph3 + plannedUph4;

        // Calculate current UPH
        const maxOutputQuery = `
            SELECT MAX(total_output_qty) AS max_output
            FROM oee_metrics 
            WHERE 
            machine_id = $1 AND timestamp <= $2
            
        `;
        const minOutputQuery = `
            SELECT MIN(total_output_qty) AS min_output
            FROM oee_metrics 
            WHERE machine_id = $1 AND timestamp >= $2
        `;

        const maxOutputResult = await pool.query(maxOutputQuery, [machineId, operatingHoursEndTime.format('YYYY-MM-DD HH:mm:ss')]);
        const minOutputResult = await pool.query(minOutputQuery, [machineId, operatingHoursStartTime.format('YYYY-MM-DD HH:mm:ss')]);

        const x = maxOutputResult.rows[0].max_output - minOutputResult.rows[0].min_output;

        const machineStatusQuery = `
            SELECT SUM(duration_minutes) AS total_duration 
            FROM machine_status 
            WHERE machine_id = $1 AND machine_status = 3 
            AND status_start_time >= $2 
            AND status_end_time <= $3
        `;
        const machineStatusResult = await pool.query(machineStatusQuery, [machineId, operatingHoursStartTime.format('YYYY-MM-DD HH:mm:ss'), operatingHoursEndTime.format('YYYY-MM-DD HH:mm:ss')]);
        const y = machineStatusResult.rows[0].total_duration / 60;

        const currentUph = Math.round(x / y);
        const uphPercentage = Math.round((currentUph / overallUph) * 100);

        res.json({
            target: overallUph,
            current: currentUph,
            uphPercentageMachine:uphPercentage
        });
    } catch (err) {
        console.error("Error executing query:", err.message);
        res.status(500).send("Server Error");
    }
});

module.exports = router;