const express = require("express");
const router = express.Router();
const pool = require("./db");
function formatTime(totalMinutes) {
    const hours = (totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:00`;

}

router.get("/getOEEmetrics", async (req, res) => {
    try {
        console.log("Received request for /getData");
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
        SELECT SUM(total_output_qty) AS total_output 
        FROM public.oee_metrics 
        WHERE "timestamp" >= $1 AND "timestamp" <= $2;
      `;

        // Query to get total rejects for today
        const queryTotalRejects = `
        SELECT SUM(total_reject_qty) AS total_rejects 
        FROM public.oee_metrics 
        WHERE "timestamp" >= $1 AND "timestamp" <= $2;
      `;

        const queryTotalRunTime = `
        SELECT SUM(machine_uptime_minute) AS totalRunTime 
        FROM public.oee_metrics 
        WHERE "timestamp" >= $1 AND "timestamp" <= $2;
        `;

        const queryTotalStopTime = `
        SELECT SUM(machine_downtime_minute) AS totalStopTime 
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
        const totalRunTime = resultTotalRunTime.rows[0].totalRunTime || 0;
        const totalRunTimeFormatted = formatTime(totalRunTime);
        const totalStopTime = resultTotalStopTime.rows[0].totalStopTime || 0;
        const totalStopTimeFormatted = formatTime(totalStopTime);
        const uniqueErrorCodes = resultUniqueErrorCodes.rows[0].uniqueerrorcodes || 0;



        // Send total output and total rejects to React frontend
        res.json({ totalOutput, totalRejects, totalRunTime: totalRunTimeFormatted,totalStopTime: totalStopTimeFormatted, uniqueErrorCodes});
    } catch (err) {
        console.error("Error executing query:", err.message);
        res.status(500).send("Server Error");
    }
});


module.exports = router;
