import express from "express"
import dotenv from "dotenv"
import mysql from "mysql2"
import bodyParser from "body-parser"
import cors from "cors"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
const router = express.Router()
import http from "http"
import { Server } from "socket.io" // For ES Modules
import axios from "axios" // Import axios
dotenv.config()
const app = express()
const port = process.env.PORT || 4000
// for notification server
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Allow CORS for all origins, you can restrict this in production
  },
})
let connectedUsers = {};

io.on("connection", (socket) => {
    // console.log("A user has been connected", socket.id);

    // When a user connects, store their socket.id and user_id (if available)
    socket.on("register_user", (user_id) => {
        connectedUsers[user_id] = socket.id;
        console.log(`User ${user_id} connected with socket ID: ${socket.id}`);
    });

    socket.on("new_resource", async (data) => {
        const { senderName, type, user_id } = data;

        // Emit a notification to all clients
        io.emit("resource_posted", {
            name: senderName,
            typeOfContributor: type,
        });

        // Create the notification message
        let notificationMessage = "";
        if (type === 1) {
            notificationMessage = `${senderName} posted a Resource`;
        } else if (type === 2) {
            notificationMessage = `${senderName} posted a Service`;
        } else {
            notificationMessage = `${senderName} donated money`;
        }

        // Insert the notification into the database
        try {
            await axios.post("http://localhost:4000/api/notification", {
                user_id,
                notification_message: notificationMessage,
            });
        } catch (err) {
            console.error(
                "Error inserting notification:",
                err.response ? err.response.data : err.message
            );
        }
    });

    // Handling notification for Event Drive
    socket.on("DriveNotification", async ({ senderName, user_id }) => {
        // Emit a notification to all clients
        io.emit("Notification_generated", {
            name: senderName,
        });

        // Insert the notification into the database
        const notificationMessage = `An Event has been posted by ${senderName}`;
        try {
            await axios.post("http://localhost:4000/api/notification", {
                user_id,
                notification_message: notificationMessage,
            });
        } catch (err) {
            console.error(
                "Error inserting notification:",
                err.response ? err.response.data : err.message
            );
        }
    });
// Handling resource booking event
socket.on("booked_resource", async ({ resourceId, resourceName, ngoName, user_id }) => {
  console.log(ngoName, resourceName); // Log both the NGO name and the resource name

  // Emit only to the user who posted the resource
  const posterSocketId = connectedUsers[user_id]; // Get the socket.id of the poster
  if (posterSocketId) {
      io.to(posterSocketId).emit("resource_booked", {
          resourceId: resourceId,
          resourceName: resourceName, // Include resource name in the emitted event
          ngoName: ngoName,
      });

            // Insert a notification into the database
            const notificationMessage = `${ngoName} has booked Resource ${resourceId}`;
            try {
                await axios.post("http://localhost:4000/api/notification", {
                    user_id, // user_id of the person who posted the resource
                    notification_message: notificationMessage,
                });
            } catch (err) {
                console.error(
                    "Error inserting notification:",
                    err.response ? err.response.data : err.message
                );
            }
        } else {
            console.error(`User with ID ${user_id} is not connected`);
        }
    });

    socket.on("disconnect", () => {
        // Remove the user from the connectedUsers list when they disconnect
        for (let userId in connectedUsers) {
            if (connectedUsers[userId] === socket.id) {
                console.log(`User ${userId} disconnected`);
                delete connectedUsers[userId];
                break; // Exit the loop once the user is found and removed
            }
        }
    });
});




app.use(cors())
app.use(bodyParser.json())

// MySQL database connection
const connection = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || "REGISTER",
})

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err)
  } else {
    console.log("Connected to MySQL database.")
  }
})

const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(403).json({ error: "No token provided" });

  const tokenParts = token.split(" ");
  if (tokenParts[0] !== "Bearer" || !tokenParts[1]) {
    return res.status(401).json({ error: "Invalid token format" });
  }

  const authToken = tokenParts[1];
  jwt.verify(authToken, process.env.JWT_SECRET || "1234", (err, decoded) => {
    if (err) return res.status(401).json({ error: "Failed to authenticate token" });
    req.userId = decoded.id;
    next();
  });
};


// Endpoint to fetch all posted services
app.get("/api/service", (req, res) => {
  const sql = `SELECT 
    s.service_id, 
    s.user_id, 
    CONCAT(u.first_name, ' ', IFNULL(u.middle_name, ''), ' ', u.last_name) AS user_name, -- Concatenate names
    s.timestamp, 
    s.service_type, 
    s.description, 
    s.status
FROM 
    Service s
JOIN 
    users u ON s.user_id = u.user_id;
`

  connection.query(sql, (err, result) => {
    if (err) {
      console.error("Error fetching services:", err)
      return res
        .status(500)
        .json({ message: "Error fetching services", error: err })
    }
    if (result.length === 0) {
      return res.status(404).json({ message: "No services found" })
    }

    res.status(200).json(result)
  })
})

// Book a Service
app.post("/api/book-service/:service_id", verifyToken, (req, res) => {
  const serviceId = req.params.service_id
  const userId = req.userId

  // Query to check if the service is available
  const checkServiceQuery = `SELECT * FROM service WHERE service_id = ? AND status = 'available'`

  connection.query(checkServiceQuery, [serviceId], (err, result) => {
    if (err) {
      console.error("Error checking service availability:", err)
      return res
        .status(500)
        .json({ message: "Error checking service availability", error: err })
    }

    if (result.length === 0) {
      return res
        .status(404)
        .json({ message: "Service not available or already booked" })
    }

    // Update the status of the service to 'unavailable'
    const updateQuery = `UPDATE service SET status = 'unavailable' WHERE service_id = ?`

    connection.query(updateQuery, [serviceId], (err, result) => {
      if (err) {
        console.error("Error updating service status:", err)
        return res
          .status(500)
          .json({ message: "Error booking service", error: err })
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Service not found" })
      }

      // Emit notification that the service was booked
      io.emit("service_booked", { serviceId, userId })

      res.status(200).json({ message: "Service booked successfully" })
    })
  })
})

app.get('/api/service/education', (req, res) => {
  const query = `
    SELECT * FROM Service 
    WHERE service_type = 'education' 
    AND status = 'available';
  `;

  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching education services:', error);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

app.get('/api/service/health', (req, res) => {
  const query = `
    SELECT * FROM Service 
    WHERE service_type = 'health' 
    AND status = 'available';
  `;

  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching education services:', error);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

app.get('/api/service/sustainability', (req, res) => {
  const query = `
    SELECT * FROM Service 
    WHERE service_type = 'sustainability' 
    AND status = 'available';
  `;

  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching education services:', error);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

app.get('/api/service/education', (req, res) => {
  const query = `
    SELECT * FROM Service 
    WHERE service_type = 'education' 
    AND status = 'available';
  `;

  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching education services:', error);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

app.get('/api/service/health', (req, res) => {
  const query = `
    SELECT * FROM Service 
    WHERE service_type = 'health' 
    AND status = 'available';
  `;

  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching education services:', error);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

app.get('/api/service/sustainability', (req, res) => {
  const query = `
    SELECT * FROM Service 
    WHERE service_type = 'sustainability' 
    AND status = 'available';
  `;

  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching education services:', error);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

// Endpoint to get user details by user_id
app.get("/api/users/:user_id", (req, res) => {
  const userId = req.params.user_id

  const sql = ` SELECT first_name, last_name FROM users WHERE user_id = ?`
  connection.query(sql, [userId], (err, result) => {
    if (err) {
      console.error("Error fetching user details:", err)
      return res.status(500).send({ message: "Error fetching user details" })
    }
    if (result.length === 0) {
      return res.status(404).send({ message: "User not found" })
    }

    res.status(200).send(result[0]) // Send back first_name and last_name
  })
})
// Registration Route
app.post("/api/register", async (req, res) => {
  const {
    user_id,
    user_type,
    first_name,
    middle_name,
    last_name,
    contact,
    email,
    password,
    address,
    city,
  } = req.body

  try {
    const checkQuery = "SELECT * FROM users WHERE email = ? OR contact = ?"
    const [result] = await connection
      .promise()
      .query(checkQuery, [email, contact])
    if (result.length > 0)
      return res
        .status(400)
        .json({ message: "Email or Contact already registered" })

    const hashedPassword = await bcrypt.hash(password, 10)
    const insertQuery =
      "INSERT INTO users (user_id, user_type, first_name, middle_name, last_name, contact, email, password, address, city) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    await connection
      .promise()
      .query(insertQuery, [
        user_id.trim(),
        user_type,
        first_name,
        middle_name,
        last_name,
        contact,
        email,
        hashedPassword,
        address,
        city,
      ])
    res.status(201).json({ message: "Registration successful" })
  } catch (err) {
    console.error("Error during registration:", err)
    res.status(500).json({ message: "Server error" })
  }
})

// Login for Contributors
app.post("/api/login/contributor", async (req, res) => {
  const { email, password } = req.body
  try {
    const query = 'SELECT * FROM users WHERE email = ? AND user_type = "C"'
    const [results] = await connection.promise().query(query, [email])
    if (results.length === 0)
      return res.status(401).json({ message: "Invalid email or password" })

    const user = results[0]
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch)
      return res.status(401).json({ message: "Invalid email or password" })

    const contributorCheckQuery =
      "SELECT * FROM Contributor WHERE contributor_id = ?"
    const [contributorCheckResult] = await connection
      .promise()
      .query(contributorCheckQuery, [user.user_id])
    if (contributorCheckResult.length === 0) {
      const insertContributorQuery =
        "INSERT INTO Contributor (contributor_id) VALUES (?)"
      await connection.promise().query(insertContributorQuery, [user.user_id])
    }

    const token = jwt.sign(
      { id: user.user_id, email: user.email },
      process.env.JWT_SECRET || "1234",
      { expiresIn: "1h" },
    )
    res
      .status(200)
      .json({ message: "Login successful", token, user_id: user.user_id })
  } catch (err) {
    console.error("Error during contributor login:", err)
    res.status(500).json({ message: "Server error" })
  }
})

// Login for NGOs
app.post("/api/login/ngo", async (req, res) => {
  const { email, password } = req.body

  try {
    const query = 'SELECT * FROM users WHERE email = ? AND user_type = "N"'
    const [results] = await connection.promise().query(query, [email])

    if (results.length === 0)
      return res.status(401).json({ message: "Invalid email or password" })

    const user = results[0]
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch)
      return res.status(401).json({ message: "Invalid email or password" })

    const ngoCheckQuery = "SELECT * FROM NGO WHERE ngo_id = ?"
    const [ngoCheckResult] = await connection
      .promise()
      .query(ngoCheckQuery, [user.user_id])
    if (ngoCheckResult.length === 0) {
      const insertNgoQuery = "INSERT INTO NGO (ngo_id) VALUES (?)"
      await connection.promise().query(insertNgoQuery, [user.user_id])
    }

    const token = jwt.sign(
      { id: user.user_id, email: user.email },
      process.env.JWT_SECRET || "1234",
      { expiresIn: "1h" },
    )
    // Respond with token and ngo_id
    res.status(200).json({ message: "Login successful", token, ngo_id: user.user_id });
  } catch (err) {
    console.error("Error during NGO login:", err)
    return res.status(500).json({ message: "Server error" })
  }
})

// API route to handle notification into table
app.post("/api/notification", (req, res) => {
  const { user_id, notification_message } = req.body

  const sql = `
      INSERT INTO Notification (user_id, notification_message, created_at) 
      VALUES (?, ?, NOW())
    `

  const values = [user_id, notification_message]

  connection.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error inserting notification:", err)
      return res
        .status(500)
        .send({ message: "Error inserting notification", error: err })
    }
    // The notification_id is the auto-incremented ID from the database
    res.status(201).send({
      message: "Notification added successfully",
      notification_id: result.insertId,
    })
  })
})
// API route to handle resource form submissions
app.post("/api/resource", (req, res) => {
  const {
    user_id,
    resource_name,
    resource_type,
    quantity,
    unit,
    duration,
    time_unit,
    description,
  } = req.body

  const sql = `
      INSERT INTO resource 
      (user_id, resource_name, resource_type, quantity, unit, duration, time_unit, description) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `

  const values = [
    user_id,
    resource_name,
    resource_type,
    quantity,
    unit,
    duration,
    time_unit,
    description,
  ]

  connection.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error inserting resource:", err)
      return res
        .status(500)
        .send({ message: "Error inserting resource", error: err })
    }
    res.status(201).send({
      message: "Resource added successfully",
      resource_id: result.insertId,
    })
  })
})

// API route to handle "Give Service" form submissions
app.post("/api/service", (req, res) => {
  // const userId = req.userId;
  const { user_id, timestamp, service_type, description } = req.body

  const sql = `
      INSERT INTO service
      (user_id, timestamp, service_type, description)
      VALUES (?, ?, ?, ?)
    `

  const values = [user_id, timestamp, service_type, description]

  connection.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error inserting service:", err)
      return res
        .status(500)
        .send({ message: "Error inserting service", error: err })
    }
    res.status(201).send({
      message: "Service added successfully",
      service_id: result.insertId,
    })
  })
})
app.get("/api/profile", verifyToken, (req, res) => {
  const userId = req.userId
  const query =
    "SELECT first_name, middle_name, last_name, contact, address FROM users WHERE user_id = ?"
  connection.query(query, [userId], (err, results) => {
    if (err) return res.status(500).json({ error: "Error fetching profile" })
    if (results.length > 0) res.json(results[0])
    else res.status(404).json({ error: "User not found" })
  })
})

// Update User Profile
app.put("/api/profile", verifyToken, (req, res) => {
  const { name, mname, lname, contact, address } = req.body
  const userId = req.userId
  if (!name || !lname || !contact || !address)
    return res
      .status(400)
      .json({ error: "All fields except middle name are required" })

  const query =
    "UPDATE users SET first_name = ?, middle_name = ?, last_name = ?, contact = ?, address = ? WHERE user_id = ?"
  connection.query(
    query,
    [name, mname || null, lname, contact, address, userId],
    (err, results) => {
      if (err) return res.status(500).json({ error: "Error updating profile" })
      if (results.affectedRows > 0)
        res.json({ message: "Profile updated successfully" })
      else res.status(404).json({ error: "User not found" })
    },
  )
})
app.get("/api/ngos", async (req, res) => {
  const { city } = req.query
  try {
    const query = `
            SELECT user_id, first_name, middle_name, last_name, contact, email, address, city
            FROM users 
            WHERE user_type = 'N' ${city ? "AND city = ?" : ""}
        `
    const [ngos] = await connection.promise().query(query, city ? [city] : [])
    console.log("NGOs fetched from DB:", ngos)
    res.json(ngos)
  } catch (err) {
    console.error("Error fetching NGOs:", err)
    res.status(500).json({ message: "Server error" })
  }
})

// Fetch food resources
app.get("/api/resources/food", (req, res) => {
  const sql =
    "SELECT * FROM resource WHERE resource_type = 'Food' AND status = 'available';"
  connection.query(sql, (err, result) => {
    if (err) {
      console.error("Error fetching food resources:", err)
      res.status(500).json({ error: err.message })
    } else {
      res.json(result)
    }
  })
})

// Fetch clothes resources
app.get("/api/resources/clothes", (req, res) => {
  const sql =
    "SELECT * FROM resource WHERE resource_type = 'Clothes' AND status = 'available';"
  connection.query(sql, (err, result) => {
    if (err) {
      console.error("Error fetching resources:", err)
      res.status(500).json({ error: err.message })
    } else {
      res.json(result)
    }
  })
})

app.get("/api/resources/other", (req, res) => {
  const sql =
    "SELECT * FROM resource WHERE resource_type = 'Other' OR resource_type = 'Toys' AND status = 'available';"
  connection.query(sql, (err, result) => {
    if (err) {
      console.error("Error fetching resources:", err)
      res.status(500).json({ error: err.message })
    } else {
      res.json(result)
    }
  })
})

// Booking resource route
app.patch("/api/resources/book/:id", async (req, res) => {
  const resourceId = req.params.id;

  try {
      // Step 1: Fetch the resource to get user_id
      const resourceQuery = "SELECT user_id FROM resource WHERE resource_id = ?";
      const [resourceResult] = await connection.promise().query(resourceQuery, [resourceId]);

      // Check if the resource exists
      if (resourceResult.length === 0) {
          return res.status(404).json({ message: "Resource not found" });
      }

      const userId = resourceResult[0].user_id; // Get user_id of the person who posted the resource

      // Step 2: Update the resource status to 'booked'
      const updateQuery = "UPDATE resource SET status = ? WHERE resource_id = ? AND status = ?";
      const values = ["booked", resourceId, "available"];

      const [updateResult] = await connection.promise().query(updateQuery, values);

      // Check if the booking was successful
      if (updateResult.affectedRows === 0) {
          return res.status(400).json({ message: "Resource already booked" });
      }

      // Step 3: Return the user_id in the response
      res.status(200).json({ message: "Resource booked successfully", user_id: userId });
  } catch (error) {
      console.error("Error booking resource:", error);
      res.status(500).json({ message: "Failed to book the resource" });
  }
});

app.post("/api/donate", async (req, res) => {
  const { donor_id, ngo_id, donation_amount } = req.body

  // Input validation
  if (!donor_id) {
    return res.status(400).json({ message: "Donor_id not found" })
  }
  if (!ngo_id) {
    return res.status(400).json({ message: "NGO not found" })
  }
  if (!donation_amount) {
    return res.status(400).json({ message: "Donation Amount not found" })
  }
  try {
    const query = `
            INSERT INTO Donations (donor_id, ngo_id, donation_amount)
            VALUES (?, ?, ?)
        `

    await connection.promise().query(query, [donor_id, ngo_id, donation_amount])

    res.status(201).json({ message: "Donation successfully recorded" })
  } catch (err) {
    console.error("Error inserting donation:", err) // Log the error
    res.status(500).json({ message: "Server error", error: err.message }) // Include error message in response
  }
})

app.get("/api/donor/:ngo_id", async (req, res) => {
  const { ngo_id } = req.params

  try {
    // Check if the NGO exists
    const ngoQuery = `
            SELECT user_id 
            FROM Users 
            WHERE user_id = ? AND user_type = 'N'
        `
    const [ngoResults] = await connection.promise().query(ngoQuery, [ngo_id])

    if (ngoResults.length === 0) {
      return res.status(404).json({ message: "NGO not found" })
    }

    // Fetch the donor ID (which is a contributor)
    const donorQuery = `
            SELECT user_id 
            FROM Users 
            WHERE user_type = 'C' -- Assuming you want to find contributors/donors
        `
    const [donorResults] = await connection.promise().query(donorQuery)

    if (donorResults.length === 0) {
      return res.status(404).json({ message: "Donor not found for this NGO" })
    }

    res.json(donorResults) // Return the donor information
  } catch (err) {
    console.error("Error fetching donor:", err)
    res.status(500).json({ message: "Server error" })
  }
})

// API route to get all NGOs from the database for review
app.get("/api/ngosforreview", (req, res) => {
  const sqlQuery = `
      SELECT user_id AS ngo_id, CONCAT(first_name, ' ', last_name) AS name 
      FROM Users
      WHERE user_type = 'N'
    `

  connection.query(sqlQuery, (err, result) => {
    if (err) {
      console.error("Database query failed:", err)
      return res.status(500).json({ error: "Database query failed" })
    }
    res.json(result) // Sends the list of NGOs in the expected format
  })
})

app.post("/api/review", verifyToken, async (req, res) => {
  const { ngoId, rating, review } = req.body
  const userId = req.userId // Get contributor's userId from JWT token

  try {
    // Insert the review into the Review table, including the rating
    const result = await new Promise((resolve, reject) => {
      connection.query(
        "INSERT INTO Review (contributor_id, ngo_id, description, rating) VALUES (?, ?, ?, ?)",
        [userId, ngoId, review, rating],
        (err, result) => {
          if (err) {
            return reject(err)
          }
          resolve(result)
        },
      )
    })

    // Check if the insert was successful
    if (result.affectedRows > 0) {
      res.status(200).json({ message: "Review submitted successfully!" })
    } else {
      res.status(500).json({ message: "Failed to submit review." })
    }
  } catch (error) {
    console.error("Error submitting review:", error.message)
    res.status(500).json({
      message: "Server error while submitting review.",
      error: error.message,
    })
  }
})
app.get('/api/resources/search', (req, res) => {
  const { search, category } = req.query;

  // Check if search query is provided
  if (!search) {
    return res.status(400).json({ error: 'Search query is required' });
  }

  try {
    // SQL query for searching resource names and optionally filtering by resource type (category)
    let sqlQuery = 'SELECT * FROM resource WHERE status="available" and UPPER(resource_name) LIKE ?'; // Case-insensitive search
    const queryParams = [`%${search.toUpperCase()}%`]; // Match any part of the resource name

    // Add category filter if provided
    if (category) {
      sqlQuery += ' AND resource_type = ?';
      queryParams.push(category);
    }

    // Execute the query
    connection.query(sqlQuery, queryParams, (err, results) => {
      if (err) {
        console.error('Error executing the query:', err.message);
        return res.status(500).json({ error: 'Database query failed', details: err.message }); // JSON response on error
      }

      // Return the search results
      if (results.length > 0) {
        return res.status(200).json(results);
      } else {
        return res.status(404).json({ error: 'No resources found matching the criteria' });
      }
    });
  } catch (error) {
    console.error('Unexpected error:', error.message);
    return res.status(500).json({ error: 'Unexpected server error', details: error.message }); // JSON error response
  }
});

app.post('/api/post-drive', verifyToken, (req, res) => {
  const { drive_name, description, drive_type, start_date, end_date } = req.body;
  const ngo_id = req.userId; // Assuming the userId corresponds to the NGO ID

  // Check if required fields are present
  if (!drive_name || !description || !drive_type || !start_date || !end_date) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const query = `INSERT INTO Drives (ngo_id, drive_name, description, drive_type, start_date, end_date) VALUES (?, ?, ?, ?, ?, ?)`;
  connection.query(query, [ngo_id, drive_name, description, drive_type, start_date, end_date], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.status(200).json({ message: 'Drive posted successfully' });
  });
});

app.get('/api/drives', (req, res) => {
  const currentDate = new Date().toISOString().slice(0, 10); // Get the current date in 'YYYY-MM-DD' format

  const query = `
    SELECT *, 
      CASE 
        WHEN start_date <= ? AND end_date >= ? THEN 'ongoing' 
        WHEN start_date > ? THEN 'upcoming' 
        ELSE 'completed' 
      END AS drive_status
    FROM Drives
    WHERE (end_date >= ? AND start_date <= ?) OR (start_date > ?)
    ORDER BY start_date ASC
  `;

  connection.query(query, [currentDate, currentDate, currentDate, currentDate, currentDate, currentDate], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    console.log('Fetched drives:', results); // Log the results for debugging
    res.status(200).json(results);
  });
});

// Start the server with Socket.IO
server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
export default router
