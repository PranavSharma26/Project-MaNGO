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
import axios from 'axios'; // Import axios



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


// const axios = require('axios'); // Import axios

io.on("connection", (socket) => {
    // console.log("A user connected");

    socket.on("new_resource", async ({ senderName, type, user_id }) => {
        // Emit a notification to all clients
        io.emit("resource_posted", {
            name: senderName,
            typeOfContributor: type,
        });

     // Create the notification message
    let notificationMessage = "";  // Use 'let' instead of 'const'
    if (type === 1) {
        notificationMessage = `${senderName} posted a Resource`;
    } else if (type === 2) {
        notificationMessage = `${senderName} posted a Service`;
    } else {
        notificationMessage = `${senderName} donated money`;
    }


        // Insert the notification into the database
        try {
            const response = await axios.post('http://localhost:4000/api/notification', {
                user_id,
                notification_message: notificationMessage,
            });

            // Log the notification ID returned from the server
            const { notification_id } = response.data;
            // console.log('Notification ID:', notification_id);
        } catch (err) {
            console.error('Error inserting notification:', err.response ? err.response.data : err.message);
        }
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

// Fetch food resources
app.get('/api/resources/food', (req, res) => {
    const sql = "SELECT * FROM resource WHERE resource_type = 'Food' AND status = 'available';";
    connection.query(sql, (err, result) => {
        if (err) {
            console.error("Error fetching resources:", err);
            res.status(500).json({ error: err.message });
        } else {
            res.json(result);
        }
    });
});
// login as a contributor
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

// API route to handle notification into table
app.post('/api/notification', (req, res) => {
    const { user_id, notification_message } = req.body;

    const sql = `
      INSERT INTO Notification (user_id, notification_message, created_at) 
      VALUES (?, ?, NOW())
    `;

    const values = [user_id, notification_message];

    connection.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error inserting notification:', err);
            return res.status(500).send({ message: 'Error inserting notification', error: err });
        }
        // The notification_id is the auto-incremented ID from the database
        res.status(201).send({ message: 'Notification added successfully', notification_id: result.insertId });
    });
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
    const { ngo_id } = req.params;
    
    try {
        // Check if the NGO exists
        const ngoQuery = `
            SELECT user_id 
            FROM Users 
            WHERE user_id = ? AND user_type = 'N'
        `;
        const [ngoResults] = await connection.promise().query(ngoQuery, [ngo_id]);
        
        if (ngoResults.length === 0) {
            return res.status(404).json({ message: 'NGO not found' });
        }
        
        // Fetch the donor ID (which is a contributor)
        const donorQuery = `
            SELECT user_id 
            FROM Users 
            WHERE user_type = 'C' -- Assuming you want to find contributors/donors
        `;
        const [donorResults] = await connection.promise().query(donorQuery);
        
        if (donorResults.length === 0) {
            return res.status(404).json({ message: 'Donor not found for this NGO' });
        }
        
        res.json(donorResults); // Return the donor information
    } catch (err) {
        console.error('Error fetching donor:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.get('/api/ngosforreview', (req, res) => {
    const sqlQuery = `
      SELECT user_id AS ngo_id, CONCAT(first_name, ' ', last_name) AS name 
      FROM Users
      WHERE user_type = 'N'
    `;
  
    connection.query(sqlQuery, (err, result) => {
      if (err) {
        console.error('Database query failed:', err);
        return res.status(500).json({ error: 'Database query failed' });
      }
      res.json(result); // Sends the list of NGOs in the expected format
    });
});
// module.exports = router;
app.post('/api/review', async (req, res) => {
    const { ngoId, rating, review } = req.body;
    const userId = req.userId; // Get contributor's userId from JWT token
    
    try {
      // Generate a unique review_id (you can use a library like uuid for this)
      const reviewId = generateUniqueId(); // Implement this function or use UUID
  
      // Insert the review into the Review table
      const result = await db.query(
        'INSERT INTO Review (review_id, contributor_id, ngo_id, description) VALUES (?, ?, ?, ?)',
        [reviewId, userId, ngoId, review] // Use userId for contributor_id
      );
  
      if (result.affectedRows > 0) {
        res.status(200).json({ message: 'Review submitted successfully!' });
      } else {
        res.status(500).json({ message: 'Failed to submit review.' });
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      res.status(500).json({ message: 'Server error while submitting review.' });
    }
});

  

// Start the server with Socket.IO
server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
export default router;