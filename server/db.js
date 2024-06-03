const { Pool } = require('pg');

console.log('Starting script');  // Added logging

const pool = new Pool({
  user: 'postgres',
  password: '1234',
  host: 'localhost',
  port: 5432,
  database: "oee",
  idleTimeoutMillis: 100
});

async function checkConnection() {
  try {
    console.log('Attempting to connect to the database');
    const client = await pool.connect();
    console.log('Connected successfully');
    client.release();
  } catch (error) {
    console.error('Error connecting to the database:', error.message);
  }
}

checkConnection();
module.exports = pool;