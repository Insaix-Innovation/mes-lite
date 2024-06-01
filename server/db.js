const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  password: '1234',
  host: 'localhost',
  port: 5432,
  database: 'oee'
});

// Function to test the database connection
async function testDatabaseConnection() {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('Database connected:', result.rows[0]);
  } catch (err) {
    console.error('Error connecting to the database:', err.stack);
  }
}

// Call the function to test the connection
testDatabaseConnection();

module.exports = pool;
