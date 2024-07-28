const express = require('express');
const router = express.Router();
const pool = require('./db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'ksPOJ92jNJL23nd'; // can create a .env file to store this

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('Received login request');

  try {
    const userQuery = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    console.log('User result:', userQuery.rows);

    if (userQuery.rows.length === 0) {
      return res.status(401).json({ message: 'No user exists' });
    }

    const user = userQuery.rows[0];

    //NOT HASHING THE PADDWORDS
    // const isPasswordValid = await bcryptcompare(password, user.password);
    // if (!isPasswordValid) {
    //     return res.status(401).json({ message: 'Invalid email or password' });
    //   }
    
    if (password !== user.password) {
        return res.status(401).json({ message: 'Password not match!' });
      }

    const token = jwt.sign({ id: user.id,username:user.username, email: user.email, role: user.role }, SECRET_KEY, {
      expiresIn: '1h',
    });

    res.json({ token , 
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
        }});

} catch (error) {
    console.error('Error during login:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
