const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "admin",
    database: "react_auth"
});

db.connect(err => {
    if (err) {
        console.error('Database connection failed: ', err);
        return;
    }
    console.log('Database connected');
});

app.post('/signup', (req, res) => {
    console.log('Received signup request:', req.body); // Log the request body
    const { name, email, password } = req.body;

    const sql = "INSERT INTO login (name, email, password) VALUES (?, ?, ?)";
    db.query(sql, [name, email, password], (err, data) => {
        if (err) {
            console.error('Error while signing up: ', err);
            return res.status(500).json({ error: 'An error occurred while signing up' });
        }
        console.log('Signup successful:', data); // Log the data returned from the database
        return res.json({ message: 'Signed up successfully' });
    });
});

app.post('/login', (req, res) => {
    console.log('Received login request:', req.body); // Log the request body
    const { email, password } = req.body;

    const sql = "SELECT * FROM login WHERE email = ? AND password = ?";
    db.query(sql, [email, password], (err, data) => {
        if (err) {
            console.error('Error while logging in: ', err);
            return res.status(500).json({ error: 'An error occurred while logging in' });
        }
        if (data.length > 0) {
            return res.json({ message: 'Success' });
        } else {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
    });
});


const server = app.listen(8085, () => {
    console.log("Server is running on port 8085");
});

process.on('SIGINT', () => {
    server.close(() => {
        console.log('Server shut down gracefully');
        db.end(err => {
            if (err) {
                console.error('Error closing database connection: ', err);
                return;
            }
            console.log('Database connection closed');
            process.exit(0);
        });
    });
});
