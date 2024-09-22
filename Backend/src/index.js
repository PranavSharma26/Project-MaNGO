import express from 'express';
import dotenv from 'dotenv';
import mysql from 'mysql2';
import bodyParser from 'body-parser';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import profileRoutes from './routes/profile.js';

const app = express();
dotenv.config();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());
app.use('/api', profileRoutes);

// MySQL database connection
const connection = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'REGISTER'
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
    } else {
        console.log('Connected to MySQL database.');
    }
});

// Register API (no changes needed here)
app.post('/api/register', async (req, res) => {
    let { user_id, user_type, first_name, middle_name, last_name, contact, email, password, address, city } = req.body;

    // Trim user_id to avoid whitespace issues
    user_id = user_id.trim();

    try {
        const checkQuery = 'SELECT * FROM users WHERE email = ? OR contact = ?';
        const [result] = await connection.promise().query(checkQuery, [email, contact]);

        if (result.length > 0) {
            const existingUser = result[0];
            if (existingUser.email === email) {
                return res.status(400).json({ field: 'email', message: 'Email is already registered' });
            }
            if (existingUser.contact === contact) {
                return res.status(400).json({ field: 'contact', message: 'Contact number is already registered' });
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const insertQuery = 'INSERT INTO users (user_id, user_type, first_name, middle_name, last_name, contact, email, password, address, city) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        await connection.promise().query(insertQuery, [user_id, user_type, first_name, middle_name, last_name, contact, email, hashedPassword, address, city]);

        return res.status(201).json({ message: 'Registration successful' });
    } catch (err) {
        console.error('Error during registration:', err);
        return res.status(500).json({ message: 'Server error' });
    }
});

// Contributor Login API
app.post('/api/login/contributor', async (req, res) => {
    const { email, password } = req.body;

    try {
        const query = 'SELECT * FROM users WHERE email = ? AND user_type = "C"';
        const [results] = await connection.promise().query(query, [email]);

        if (results.length === 0) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Create a JWT token with user_id and email
        const token = jwt.sign(
            { user_id: user.user_id, email: user.email },
            process.env.JWT_SECRET || '1234',
            { expiresIn: '1h' }
        );

        // Return token and user_id
        res.status(200).json({ message: 'Login successful', token, user_id: user.user_id });
    } catch (err) {
        console.error('Error during contributor login:', err);
        return res.status(500).json({ message: 'Server error' });
    }
});

// NGO Login API
app.post('/api/login/ngo', async (req, res) => {
    const { email, password } = req.body;

    try {
        const query = 'SELECT * FROM users WHERE email = ? AND user_type = "N"';
        const [results] = await connection.promise().query(query, [email]);

        if (results.length === 0) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Create a JWT token with user_id and email
        const token = jwt.sign(
            { user_id: user.user_id, email: user.email },
            process.env.JWT_SECRET || '1234',
            { expiresIn: '1h' }
        );

        // Return token and user_id
        res.status(200).json({ message: 'Login successful', token, user_id: user.user_id });
    } catch (err) {
        console.error('Error during NGO login:', err);
        return res.status(500).json({ message: 'Server error' });
    }
});

// API route to handle resource form submissions
app.post('/api/resource', (req, res) => {
    const { user_id, resource_name, resource_type, quantity, unit, duration, time_unit, description } = req.body;

    const sql = `
      INSERT INTO resource 
      (user_id, resource_name, resource_type, quantity, unit, duration, time_unit, description) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [user_id, resource_name, resource_type, quantity, unit, duration, time_unit, description];

    connection.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error inserting resource:', err);
            console.log("user_id:", user_id);
            return res.status(500).send({ message: 'Error inserting resource', error: err });
        }
        res.status(201).send({ message: 'Resource added successfully', resource_id: result.insertId });
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
