import express from 'express';
import dotenv from 'dotenv';
import mysql from 'mysql2';
import bodyParser from 'body-parser';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const router = express.Router();
import http from 'http';
import { Server } from 'socket.io';  // For ES Modules

dotenv.config();
const app = express();
const port = process.env.PORT || 4000;


// for notification server
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173", // Allow CORS for all origins, you can restrict this in production
    }
});


// receiving from Contributor

io.on("connection", (socket) => {
    // console.log("A user connected");

    socket.on("new_resource", ({ senderName }) => {
        // Emit a notification to all clients
        io.emit("resource_posted", {
            name: senderName, // Make sure to use a consistent key
        });
    });

    socket.on("disconnect", () => {
        console.log("Someone has left");
    });
});

app.use(cors());
app.use(bodyParser.json());

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


// Endpoint to get user details by user_id
app.get('/api/users/:user_id', (req, res) => {
    const userId = req.params.user_id;
  
    const sql = `SELECT first_name, last_name FROM users WHERE user_id = ?`;
    connection.query(sql, [userId], (err, result) => {
      if (err) {
        console.error('Error fetching user details:', err);
        return res.status(500).send({ message: 'Error fetching user details' });
      }
      if (result.length === 0) {
        return res.status(404).send({ message: 'User not found' });
      }
  
      res.status(200).send(result[0]); // Send back first_name and last_name
    });
  });
  


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

// API route to handle "Give Service" form submissions
app.post('/api/service', (req, res) => {
    // const userId = req.userId;
    const {user_id, timestamp, service_type, description } = req.body;

    const sql = `
      INSERT INTO service
      (user_id, timestamp, service_type, description)
      VALUES (?, ?, ?, ?)
    `;

    const values = [user_id, timestamp, service_type, description];

    connection.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error inserting service:', err);
            return res.status(500).send({ message: 'Error inserting service', error: err });
        }
        res.status(201).send({ message: 'Service added successfully', service_id: result.insertId });
    });
});
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

// API route to get all NGOs from the database for review
router.get('/api/ngosforreview', (req, res) => {
    const sqlQuery = 'SELECT id, name FROM NGO'; // Fetch ID and name of NGOs
    connection.query(sqlQuery, (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Database query failed' });
      }
      res.json(result); // Send the list of NGOs to the frontend
    });
  });

  app.get('/api/ngos', async (req, res) => {
    const { city } = req.query;
    try {
        const query = `
            SELECT user_id, first_name, middle_name, last_name, contact, email, address, city
            FROM users 
            WHERE user_type = 'N' ${city ? 'AND city = ?' : ''}
        `;
        const [ngos] = await connection.promise().query(query, city ? [city] : []);
        console.log('NGOs fetched from DB:', ngos);
        res.json(ngos);
    } catch (err) {
        console.error('Error fetching NGOs:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Fetch clothes resources
app.get('/api/resources/clothes', (req, res) => {
    const sql = "SELECT * FROM resource WHERE resource_type = 'Clothes' AND status = 'available';";
    connection.query(sql, (err, result) => {
        if (err) {
            console.error("Error fetching resources:", err);
            res.status(500).json({ error: err.message });
        } else {
            res.json(result);
        }
    });
});

app.get('/api/resources/other', (req, res) => {
    const sql = "SELECT * FROM resource WHERE resource_type = 'Other' OR resource_type = 'Toys' AND status = 'available';";
    connection.query(sql, (err, result) => {
        if (err) {
            console.error("Error fetching resources:", err);
            res.status(500).json({ error: err.message });
        } else {
            res.json(result);
        }
    });
});

// Booking resource route
app.patch('/api/resources/book/:id', async (req, res) => {
    const resourceId = req.params.id;

    try {
        const updateQuery = 'UPDATE resource SET status = ? WHERE resource_id = ? AND status = ?';
        const values = ['booked', resourceId, 'available'];

        const [result] = await connection.promise().query(updateQuery, values);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Resource not found or already booked' });
        }
        
        res.status(200).json({ message: 'Resource booked successfully' });
    } catch (error) {
        console.error('Error booking resource:', error);
        res.status(500).json({ message: 'Failed to book the resource' });
    }
});

app.post('/api/donate', async (req, res) => {
    const { donor_id, ngo_id, donation_amount } = req.body;

    // Input validation
    if (!donor_id) {
        return res.status(400).json({ message: 'Donor_id not found' });
    }
    if (!ngo_id) {
        return res.status(400).json({ message: 'NGO not found' });
    }
    if (!donation_amount) {
        return res.status(400).json({ message: 'Donation Amount not found' });
    }
    try {
        const query = `
            INSERT INTO Donations (donor_id, ngo_id, donation_amount)
            VALUES (?, ?, ?)
        `;
        
        await connection.promise().query(query, [donor_id, ngo_id, donation_amount]);
        
        res.status(201).json({ message: 'Donation successfully recorded' });
    } catch (err) {
        console.error('Error inserting donation:', err); // Log the error
        res.status(500).json({ message: 'Server error', error: err.message }); // Include error message in response
    }
});

app.get('/api/donor/:ngo_id', async (req, res) => {
    const ngo_id = req.params.ngo_id;

    try {
        const query = `
            SELECT user_id FROM Donor 
            WHERE ngo_id = ? 
        `;
        const [result] = await connection.promise().query(query, [ngo_id]);

        if (result.length > 0) {
            res.json({ donor_id: result[0].user_id }); // Send back the donor ID
        } else {
            res.status(404).json({ message: 'Donor not found for this NGO' });
        }
    } catch (err) {
        console.error('Error fetching donor:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Start the server with Socket.IO
server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
export default router;