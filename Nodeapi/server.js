// server.js
const express = require('express');
const db = require('./db'); // Import the database connection

const app = express();
const port = 3009;
// Middleware to parse JSON bodies
app.use(express.json());

// Define a simple route
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// Example route to fetch data from a table
app.get('/Cijfers', (req, res) => {
    const query = 'SELECT * FROM Cijfers'; // Replace 'users' with your actual table name
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});
app.get('/Studenten', (req, res) => {
    console.log('Received request for /Studenten');
    db.query('SELECT * FROM Studenten', (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).send('Internal Server Error');
        }
        console.log('Results:', results); // Log the results
        res.json(results);
    });
});

app.get('/docenten', (req, res) => {
    const query = 'SELECT * FROM Docenten'; // SQL query to select all from Docenten
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

app.get('/Rollen', (req, res) => {
    const query = 'SELECT * FROM Rollen'; // SQL query to select all from Docenten
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

app.get('/klassen', (req, res) => {
    const query = 'SELECT * FROM Klassen'; // SQL query to select all from Docenten
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

app.get('/vakken', (req, res) => {
    const query = 'SELECT * FROM Vakken'; // SQL query to select all from Docenten
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

app.get('/logs', (req, res) => {
    const query = 'SELECT * FROM Logs'; // SQL query to select all from Docenten
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});