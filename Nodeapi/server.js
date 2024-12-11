// server.js
const express = require('express');
const cors = require('cors');
const db = require('./db'); // Import the database connection
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const port = 3009;
require('dotenv').config();


const corsOptions = {
    origin: 'http://localhost:3000', // Specifieke origin
    credentials: true 
  };

const app = express();
app.use(cors(corsOptions)); // To allow cross-origin requests
app.use(express.json()); // To parse JSON bodies

const studentenRoutes = require('./routes/studenten');
app.use('/studenten', studentenRoutes);
const docentenRoutes = require('./routes/docenten');
app.use('/docenten', docentenRoutes);
const cijfersRoutes = require('./routes/cijfers');
app.use('/cijfers', cijfersRoutes);
const klassenRoutes = require('./routes/klassen');
app.use('/klassen', klassenRoutes);
const vakkenRoutes = require('./routes/vakken');
app.use('/vakken', vakkenRoutes);
const logsRoutes = require('./routes/logs');
app.use('/logs', logsRoutes);
const rollenRoutes = require('./routes/rollen');
app.use('/rollen', rollenRoutes);
const pivot__docentvakkenRoutes = require('./routes/pivot__docentvakken');
app.use('/pivot__docentvakken', pivot__docentvakkenRoutes);


// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});