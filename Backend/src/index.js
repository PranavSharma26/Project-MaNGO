import express from 'express';
import dotenv from 'dotenv';
import mysql from 'mysql2';
import bodyParser from 'body-parser';
import cors from 'cors';
import bcrypt from 'bcrypt'; // bcrypt for password hashing
import jwt from 'jsonwebtoken'; // jwt for token generation

const app = express();
dotenv.config();
const port = process.env.PORT || 4000;

app.use(cors());
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
app.post('/api/register', async (req, res) => {
    const { user_id, user_type, first_name, middle_name, last_name, contact, email, password, address, city } = req.body;

    try {
        // Check if email or contact is already registered
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

        // Hash the password before storing it
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user
        const insertQuery = 'INSERT INTO users (user_id, user_type, first_name, middle_name, last_name, contact, email, password, address, city) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        await connection.promise().query(insertQuery, [user_id, user_type, first_name, middle_name, last_name, contact, email, hashedPassword, address, city]);

        return res.status(201).json({ message: 'Registration successful' });
    } catch (err) {
        console.error('Error during registration:', err);
        return res.status(500).json({ message: 'Server error' });
    }
});

// Login route for contributors
app.post('/api/login/contributor', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Query to find user by email
        const query = 'SELECT * FROM users WHERE email = ? AND user_type = "C"';
        const [results] = await connection.promise().query(query, [email]);

        if (results.length === 0) {
            console.log('User not found:', email);
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const user = results[0];

        // Compare provided password with hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log('Password mismatch for user:', email);
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate a JWT token using the secret key
        const token = jwt.sign(
            { id: user.user_id, email: user.email },
            process.env.JWT_SECRET || '1234', // Use your JWT_SECRET (or '1234' as a fallback)
            { expiresIn: '1h' }
        );

        // Respond with success and token
        res.status(200).json({ message: 'Login successful', token });
    } catch (err) {
        console.error('Error during contributor login:', err);
        return res.status(500).json({ message: 'Server error' });
    }
});

// Login route for NGOs
app.post('/api/login/ngo', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the user exists and is of type 'ngo'
        const query = 'SELECT * FROM users WHERE email = ? AND user_type = "N"';
        const [results] = await connection.promise().query(query, [email]);

        if (results.length === 0) {
            console.log('User not found:', email);
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const user = results[0];

        // Verify the password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log('Password mismatch for user:', email);
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate a JWT token
        const token = jwt.sign(
            { id: user.user_id, email: user.email },
            process.env.JWT_SECRET || '1234',
            { expiresIn: '1h' }
        );

        res.status(200).json({ message: 'Login successful', token });
    } catch (err) {
        console.error('Error during NGO login:', err);
        return res.status(500).json({ message: 'Server error' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
