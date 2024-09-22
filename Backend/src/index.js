// app.js (Backend with Express, MySQL, JWT integration)
import express from 'express';
import dotenv from 'dotenv';
import mysql from 'mysql2';
import bodyParser from 'body-parser';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import profileRoutes from './routes/profile.js';

dotenv.config();
const app = express();
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

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).json({ error: 'No token provided' });

    jwt.verify(token, process.env.JWT_SECRET || '1234', (err, decoded) => {
        if (err) return res.status(401).json({ error: 'Failed to authenticate token' });
        req.userId = decoded.id;
        next();
    });
};

// Registration Route
app.post('/api/register', async (req, res) => {
    const { user_id, user_type, first_name, middle_name, last_name, contact, email, password, address, city } = req.body;

    try {
        const checkQuery = 'SELECT * FROM users WHERE email = ? OR contact = ?';
        const [result] = await connection.promise().query(checkQuery, [email, contact]);
        if (result.length > 0) return res.status(400).json({ message: 'Email or Contact already registered' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const insertQuery = 'INSERT INTO users (user_id, user_type, first_name, middle_name, last_name, contact, email, password, address, city) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        await connection.promise().query(insertQuery, [user_id.trim(), user_type, first_name, middle_name, last_name, contact, email, hashedPassword, address, city]);
        res.status(201).json({ message: 'Registration successful' });
    } catch (err) {
        console.error('Error during registration:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Login for Contributors
app.post('/api/login/contributor', async (req, res) => {
    const { email, password } = req.body;
    try {
        const query = 'SELECT * FROM users WHERE email = ? AND user_type = "C"';
        const [results] = await connection.promise().query(query, [email]);
        if (results.length === 0) return res.status(401).json({ message: 'Invalid email or password' });

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' });

        const contributorCheckQuery = 'SELECT * FROM Contributor WHERE contributor_id = ?';
        const [contributorCheckResult] = await connection.promise().query(contributorCheckQuery, [user.user_id]);
        if (contributorCheckResult.length === 0) {
            const insertContributorQuery = 'INSERT INTO Contributor (contributor_id) VALUES (?)';
            await connection.promise().query(insertContributorQuery, [user.user_id]);
        }

        const token = jwt.sign({ id: user.user_id, email: user.email }, process.env.JWT_SECRET || '1234', { expiresIn: '1h' });
        res.status(200).json({ message: 'Login successful', token, user_id: user.user_id });
    } catch (err) {
        console.error('Error during contributor login:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Login for NGOs
app.post('/api/login/ngo', async (req, res) => {
    const { email, password } = req.body;

    try {
        const query = 'SELECT * FROM users WHERE email = ? AND user_type = "N"';
        const [results] = await connection.promise().query(query, [email]);

        if (results.length === 0) return res.status(401).json({ message: 'Invalid email or password' });

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' });

        const ngoCheckQuery = 'SELECT * FROM NGO WHERE ngo_id = ?';
        const [ngoCheckResult] = await connection.promise().query(ngoCheckQuery, [user.user_id]);
        if (ngoCheckResult.length === 0) {
            const insertNgoQuery = 'INSERT INTO NGO (ngo_id) VALUES (?)';
            await connection.promise().query(insertNgoQuery, [user.user_id]);
        }

        const token = jwt.sign({ id: user.user_id, email: user.email }, process.env.JWT_SECRET || '1234', { expiresIn: '1h' });
        res.status(200).json({ message: 'Login successful', token });
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
            return res.status(500).send({ message: 'Error inserting resource', error: err });
        }
        res.status(201).send({ message: 'Resource added successfully', resource_id: result.insertId });
    });
});

// Fetch User Profile (Using JWT)
app.get('/api/profile', verifyToken, (req, res) => {
    const userId = req.userId;
    const query = 'SELECT first_name, middle_name, last_name, contact, address FROM users WHERE user_id = ?';
    connection.query(query, [userId], (err, results) => {
        if (err) return res.status(500).json({ error: 'Error fetching profile' });
        if (results.length > 0) res.json(results[0]);
        else res.status(404).json({ error: 'User not found' });
    });
});

// Update User Profile
app.put('/api/profile', verifyToken, (req, res) => {
    const { name, mname, lname, contact, address } = req.body;
    const userId = req.userId;
    if (!name || !lname || !contact || !address) return res.status(400).json({ error: 'All fields except middle name are required' });

    const query = 'UPDATE users SET first_name = ?, middle_name = ?, last_name = ?, contact = ?, address = ? WHERE user_id = ?';
    connection.query(query, [name, mname || null, lname, contact, address, userId], (err, results) => {
        if (err) return res.status(500).json({ error: 'Error updating profile' });
        if (results.affectedRows > 0) res.json({ message: 'Profile updated successfully' });
        else res.status(404).json({ error: 'User not found' });
    });
});

// Fetch the NGO
app.get('/api/ngos', async (req, res) => {
    const { city } = req.query;
    try {
        const query = `
            SELECT user_id, first_name, middle_name, last_name, contact, email, address, city 
            FROM users 
            WHERE user_type = 'N' AND city = ?`;

        const [results] = await connection.promise().query(query, [city]);
        res.status(200).json({ ngos: results });
    } catch (err) {
        console.error('Error fetching NGOs:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Fetch food resources
app.get('/api/resources/food', (req, res) => {
    const sql = "SELECT * FROM resource WHERE resource_type = 'Food';";
    connection.query(sql, (err, result) => {
        if (err) {
            console.error("Error fetching resources:", err);
            res.status(500).json({ error: err.message });
        } else {
            res.json(result);
        }
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
