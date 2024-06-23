const express = require("express");
const router = express.Router();
const pool = require("./db");
const moment = require('moment');  
const { c } = require("tar");

function formatTime(totalMinutes) {
    const days = Math.floor(totalMinutes / (24 * 60));
    const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
    const minutes = totalMinutes % 60;
    return `${days}:${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
}

router.get("/getOEEmetrics", async (req, res) => {
    try {
        console.log("Received request for /getOEEmetrics");
        const test = await pool.query("SELECT * FROM public.oee_metrics");
        res.json(test.rows);
    } catch (err) {
        console.error("Error executing query:", err.message);
        res.status(500).send("Server Error");
    }
});

router.get("/getOverview", async (req, res) => {
    try {
        console.log("Received request for /getOverview");

        // Get today's date
        const today = new Date();
        const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
        const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);

        // Query to get total output for today
        const queryTotalOutput = `
        SELECT MAX(total_output_qty) - MIN(total_output_qty) AS total_output 
        FROM public.oee_metrics 
        WHERE "timestamp" >= $1 AND "timestamp" <= $2;
      `;

        // Query to get total rejects for today
        const queryTotalRejects = `
        SELECT MAX(total_reject_qty) - MIN(total_reject_qty) AS total_rejects 
        FROM public.oee_metrics 
        WHERE "timestamp" >= $1 AND "timestamp" <= $2;
      `;

        const queryTotalRunTime = `
        SELECT 
            MAX((machine_uptime_day * 24 * 60) + (machine_uptime_hr * 60) + machine_uptime_minute) - 
            MIN((machine_uptime_day * 24 * 60) + (machine_uptime_hr * 60) + machine_uptime_minute) AS total_run_time 
        FROM public.oee_metrics 
        WHERE "timestamp" >= $1 AND "timestamp" <= $2;
        `;

        const queryTotalStopTime = `
        SELECT 
            MAX((machine_downtime_day * 24 * 60) + (machine_downtime_hr * 60) + machine_downtime_minute) - 
            MIN((machine_downtime_day * 24 * 60) + (machine_downtime_hr * 60) + machine_downtime_minute) AS total_stop_time 
        FROM public.oee_metrics 
        WHERE "timestamp" >= $1 AND "timestamp" <= $2;
        `;

        const queryUniqueErrorCodes = `
            SELECT 
                COUNT(DISTINCT error_code) AS uniqueErrorCodes 
            FROM 
                public.oee_metrics 
            WHERE 
                "timestamp" >= $1 AND "timestamp" <= $2;
        `;

        // Execute the queries
        const resultTotalOutput = await pool.query(queryTotalOutput, [startOfToday, endOfToday]);
        const resultTotalRejects = await pool.query(queryTotalRejects, [startOfToday, endOfToday]);
        const resultTotalRunTime = await pool.query(queryTotalRunTime, [startOfToday, endOfToday]);
        const resultTotalStopTime = await pool.query(queryTotalStopTime, [startOfToday, endOfToday]);
        const resultUniqueErrorCodes = await pool.query(queryUniqueErrorCodes, [startOfToday, endOfToday]);

        // Extract total output and total rejects
        const totalOutput = resultTotalOutput.rows[0].total_output || 0;
        const totalRejects = resultTotalRejects.rows[0].total_rejects || 0;
        const totalRunTime = resultTotalRunTime.rows[0].total_run_time || 0;
        const totalRunTimeFormatted = formatTime(totalRunTime);
        const totalStopTime = resultTotalStopTime.rows[0].total_stop_time || 0;
        const totalStopTimeFormatted = formatTime(totalStopTime);
        const uniqueErrorCodes = resultUniqueErrorCodes.rows[0].uniqueerrorcodes || 0;

        console.log(totalRunTime);
        console.log(totalRunTimeFormatted);
        console.log(totalStopTime);
        console.log(totalStopTimeFormatted);

        // Send total output and total rejects to React frontend
        res.json({ totalOutput, totalRejects, totalRunTime: totalRunTimeFormatted, totalStopTime: totalStopTimeFormatted, uniqueErrorCodes });
    } catch (err) {
        console.error("Error executing query:", err.message);
        res.status(500).send("Server Error");
    }
});

router.get('/calculateOverallUPH', async (req, res) => {
    try {
        console.log("Received request for /calculateOverallUPH");
        
        // Get operating hours from default_values
        const defaultValuesQuery = `SELECT operating_hours_start, operating_hours_end FROM default_values`;
        const defaultValuesResult = await pool.query(defaultValuesQuery);
        const operatingHoursStart = defaultValuesResult.rows[0].operating_hours_start;
        const operatingHoursEnd = defaultValuesResult.rows[0].operating_hours_end;

        const today = moment().format('YYYY-MM-DD');
        // const today = moment().subtract(1, 'days').format('YYYY-MM-DD');
        const operatingHoursStartTime = moment(`${today} ${operatingHoursStart}`, 'YYYY-MM-DD HH:mm:ss');
        const operatingHoursEndTime = moment(`${today} ${operatingHoursEnd}`, 'YYYY-MM-DD HH:mm:ss');

        console.log("Operating Hours Start Time: ", operatingHoursStartTime.format('YYYY-MM-DD HH:mm:ss'));
        console.log("Operating Hours End Time: ", operatingHoursEndTime.format('YYYY-MM-DD HH:mm:ss'));

        // Get list of jobs planned for the day
        const plannedJobsQuery = `
            SELECT * FROM job_order 
            WHERE job_start_time BETWEEN $1 AND $2
            AND job_completion_status = false
        `;
        const plannedJobsResult = await pool.query(plannedJobsQuery, [operatingHoursStartTime.format('YYYY-MM-DD HH:mm:ss'), operatingHoursEndTime.format('YYYY-MM-DD HH:mm:ss')]);
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
            WHERE timestamp <= $1
        `;
        const minOutputQuery = `
            SELECT MIN(total_output_qty) AS min_output
            FROM oee_metrics 
            WHERE timestamp >= $1
        `;

        const maxOutputResult = await pool.query(maxOutputQuery, [operatingHoursEndTime.format('YYYY-MM-DD HH:mm:ss')]);
        const minOutputResult = await pool.query(minOutputQuery, [operatingHoursStartTime.format('YYYY-MM-DD HH:mm:ss')]);

        const x = maxOutputResult.rows[0].max_output - minOutputResult.rows[0].min_output;

        const machineStatusQuery = `
            SELECT SUM(duration_minutes) AS total_duration 
            FROM machine_status 
            WHERE machine_status = 3 
            AND status_start_time >= $1 
            AND status_end_time <= $2
        `;
        const machineStatusResult = await pool.query(machineStatusQuery, [operatingHoursStartTime.format('YYYY-MM-DD HH:mm:ss'), operatingHoursEndTime.format('YYYY-MM-DD HH:mm:ss')]);
        const y = machineStatusResult.rows[0].total_duration / 60;

        const currentUph = Math.round(x / y);
        const uphPercentage = Math.round((currentUph / overallUph) * 100);

        res.json({
            target: overallUph,
            current: currentUph,
            uphPercentage
        });
    } catch (err) {
        console.error("Error executing query:", err.message);
        res.status(500).send("Server Error");
    }
});

router.get('/calculateMachineUPH', async (req, res) => {
    try {
        console.log("Received request for /calculateMachineUPH");
        
        // Get operating hours from default_values
        const defaultValuesQuery = `SELECT operating_hours_start, operating_hours_end FROM default_values`;
        const defaultValuesResult = await pool.query(defaultValuesQuery);
        const operatingHoursStart = defaultValuesResult.rows[0].operating_hours_start;
        const operatingHoursEnd = defaultValuesResult.rows[0].operating_hours_end;

        const today = moment().format('YYYY-MM-DD');
        const operatingHoursStartTime = moment(today + ' ' + operatingHoursStart, 'YYYY-MM-DD HH:mm:ss');
        const operatingHoursEndTime = moment(today + ' ' + operatingHoursEnd, 'YYYY-MM-DD HH:mm:ss');

        console.log(operatingHoursStartTime.format('YYYY-MM-DD HH:mm:ss'));
        console.log(operatingHoursEndTime.format('YYYY-MM-DD HH:mm:ss'));
        
        // Calculate current UPH for each machine
        const machineOutputQuery = `
            SELECT 
                machine_id,
                MAX(total_output_qty) FILTER (WHERE timestamp <= $2) - MIN(total_output_qty) FILTER (WHERE timestamp >= $1) AS output_difference
            FROM 
                oee_metrics
            WHERE
                timestamp BETWEEN $1 AND $2
            GROUP BY 
                machine_id
            ORDER BY 
                machine_id ASC
            LIMIT 10
        `;
        const machineOutputResult = await pool.query(machineOutputQuery, [operatingHoursStartTime.format('YYYY-MM-DD HH:mm:ss'), operatingHoursEndTime.format('YYYY-MM-DD HH:mm:ss')]);
        console.log(machineOutputResult.rows);

        const machineDurationQuery = `
            SELECT 
                machine_id,
                SUM(duration_minutes) FILTER (WHERE machine_status = 3 AND status_start_time >= $1 AND status_end_time <= $2) / 60 AS total_duration
            FROM 
                machine_status
            WHERE
                status_start_time >= $1 AND status_end_time <= $2
            GROUP BY 
                machine_id
            ORDER BY 
                machine_id ASC
            LIMIT 10
        `;
        const machineDurationResult = await pool.query(machineDurationQuery, [operatingHoursStartTime.format('YYYY-MM-DD HH:mm:ss'), operatingHoursEndTime.format('YYYY-MM-DD HH:mm:ss')]);
        console.log(machineDurationResult.rows);

        const machineDurationMap = machineDurationResult.rows.reduce((map, row) => {
            map[row.machine_id] = row.total_duration;
            return map;
        }, {});

        const machineUphData = machineOutputResult.rows.map((outputRow) => {
            const totalDuration = machineDurationMap[outputRow.machine_id];
            const machineUph = totalDuration ? Math.round(outputRow.output_difference / totalDuration) : 0;
            return {
                machine_id: outputRow.machine_id,
                uph: machineUph
            };
        });

        console.log(machineUphData);

        res.json({
            machineUphData
        });
    } catch (err) {
        console.error("Error executing query:", err.message);
        res.status(500).send("Server Error");
    }
});


router.get("/getMachineStatus", async (req, res) => {
    try {
        console.log("Received request for /getMachineStatus");
        const test = await pool.query("SELECT machine_status FROM public.machine_status where machine_id = 'M01' ORDER BY status_start_time DESC LIMIT 1");
        res.json(test.rows);
    } catch (err) {
        console.error("Error executing query:", err.message);
        res.status(500).send("Server Error");
    }
});

module.exports = router;
