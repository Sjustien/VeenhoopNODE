// server.js
const express = require('express');
const cors = require('cors');
const db = require('./db'); // Import the database connection
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const port = 3009;
require('dotenv').config();


const corsOptions = {
    origin: 'http://localhost:*', // Specifieke origin
    credentials: true 
  };

const app = express();
app.use(cors(corsOptions)); // To allow cross-origin requests
app.use(express.json()); // To parse JSON bodies

const studentencontroller = require('./controllers/studenten');
app.use('/studenten', studentencontroller);

const docentencontroller = require('./controllers/docenten');
app.use('/docenten', docentencontroller);

const cijferscontroller = require('./controllers/cijfers');
app.use('/cijfers', cijferscontroller);

const klassencontroller = require('./controllers/klassen');
app.use('/klassen', klassencontroller);

const vakkencontroller = require('./controllers/vakken');
app.use('/vakken', vakkencontroller);

const logscontroller = require('./controllers/logs');
app.use('/logs', logscontroller);

const rollencontroller = require('./controllers/rollen');
app.use('/rollen', rollencontroller);

const pivot__docentvakkencontroller = require('./controllers/pivot__docentvakken');
app.use('/pivot__docentvakken', pivot__docentvakkencontroller);

const pdfcontroller = require('./controllers/studentController');
app.use('/studentController', pdfcontroller);


// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});