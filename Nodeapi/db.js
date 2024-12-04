const mysql = require('mysql');

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost', // Connect to MySQL on localhost
    user: 'root',      // MySQL username
    password: '',      // MySQL password (empty in this case)
    database: 'db'     // Name of the database to connect to
});

// Connect to the database
db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        process.exit(1); // Exit the application if connection fails
    } else {
        console.log('Connected to the MySQL database');
    }
});

module.exports = db;