import express from 'express';
import dotenv from 'dotenv';
import mysql from 'mysql2';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
app.use(cors());
dotenv.config();
const port = process.env.PORT || 4000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Create a connection to the database
const connection = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'REGISTER'
});

// Connect to the database
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
    } else {
        console.log('Connected to MySQL database.');
    }
});

// Register route
app.post('/api/register', (req, res) => {
    const { user_id, user_type, first_name, middle_name, last_name, contact, email, password, address, city } = req.body;

    // Query to check if the email or contact is already registered
    const checkQuery = 'SELECT * FROM users WHERE email = ? OR contact = ?';
    connection.query(checkQuery, [email, contact], (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json({ message: 'Server error' });
        }

        if (result.length > 0) {
            // Email or contact already registered
            const existingUser = result[0];
            if (existingUser.email === email) {
                return res.status(400).json({ field: 'email', message: 'Email is already registered' });
            }
            if (existingUser.contact === contact) {
                return res.status(400).json({ field: 'contact', message: 'Contact number is already registered' });
            }
        }

        // If email and contact are not registered, insert new user
        const insertQuery = 'INSERT INTO users (user_id, user_type, first_name, middle_name, last_name, contact, email, password, address, city) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        connection.query(insertQuery, [user_id, user_type, first_name, middle_name, last_name, contact, email, password, address, city], (err, result) => {
            if (err) {
                console.error('Error inserting user:', err);
                return res.status(500).json({ message: 'Server error' });
            }
            return res.status(201).json({ message: 'Registration successful' });
        });
    });
});

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
