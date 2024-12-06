// server.js
const express = require('express');
const db = require('./db'); // Import the database connection

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

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
    console.log('Received request for /Cijfers');
    db.query('SELECT * FROM Cijfers', (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).send('Internal Server Error');
        }
        console.log('Results:', results); // Log the results
        res.json(results);
    });
});

// get cijfers by id
app.get('/Cijfers/:id', (req, res) => {
    const cijferId = req.params.id;
    db.query('SELECT * FROM Cijfers WHERE CijferID = ?', [cijferId], (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).send('Internal Server Error');
        }
        if (results.length === 0) {
            return res.status(404).send('Cijfer niet gevonden');
        }
        res.json(results[0]);
    });
});
// post cijfers
app.post('/Cijfers', (req, res) => {
    const { StudentID, VakID, Blok, Cijfer, IngevoerdDoorDocentID, IngevoerdOp } = req.body;

    const insertQuery = 'INSERT INTO Cijfers (StudentID, VakID, Blok, Cijfer, IngevoerdDoorDocentID, IngevoerdOp) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(insertQuery, [StudentID, VakID, Blok, Cijfer, IngevoerdDoorDocentID, IngevoerdOp], (err, results) => {
        if (err) {
            console.error('Database insert error:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.status(201).json({ message: 'Cijfer toegevoegd', cijferId: results.insertId });
    });
});
// put cijfers
app.put('/Cijfers/:id', (req, res) => {
    const cijferId = req.params.id;
    const { StudentID, VakID, Blok, Cijfer, IngevoerdDoorDocentID, IngevoerdOp } = req.body;

    // Huidige gegevens ophalen
    db.query('SELECT * FROM Cijfers WHERE CijferID = ?', [cijferId], (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).send('Internal Server Error');
        }
        if (results.length === 0) {
            return res.status(404).send('Cijfer niet gevonden');
        }

        // Bijwerken van de gegevens
        const currentCijfer = results[0];

        // Gebruik de huidige waarde als de nieuwe waarde niet is opgegeven
        const updatedStudentID = StudentID !== undefined ? StudentID : currentCijfer.StudentID;
        const updatedVakID = VakID !== undefined ? VakID : currentCijfer.VakID;
        const updatedBlok = Blok !== undefined ? Blok : currentCijfer.Blok;
        const updatedCijfer = Cijfer !== undefined ? Cijfer : currentCijfer.Cijfer;
        const updatedIngevoerdDoorDocentID = IngevoerdDoorDocentID !== undefined ? IngevoerdDoorDocentID : currentCijfer.IngevoerdDoorDocentID;
        const updatedIngevoerdOp = IngevoerdOp !== undefined ? IngevoerdOp : currentCijfer.IngevoerdOp;

        const updateQuery = `
            UPDATE Cijfers 
            SET 
                StudentID = ?, 
                VakID = ?, 
                Blok = ?, 
                Cijfer = ?, 
                IngevoerdDoorDocentID = ?, 
                IngevoerdOp = ? 
            WHERE CijferID = ?`;

        db.query(updateQuery, [updatedStudentID, updatedVakID, updatedBlok, updatedCijfer, updatedIngevoerdDoorDocentID, updatedIngevoerdOp, cijferId], (err, results) => {
            if (err) {
                console.error('Database update error:', err);
                return res.status(500).send('Internal Server Error');
            }
            if (results.affectedRows === 0) {
                return res.status(404).send('Cijfer niet gevonden');
            }
            res.json({ message: 'Cijfer bijgewerkt' });
        });
    });
});
//delete cijfers

app.delete('/Cijfers/:id', (req, res) => {
    const cijferId = req.params.id;
    db.query('DELETE FROM Cijfers WHERE CijferID = ?', [cijferId], (err, results) => {
        if (err) {
            console.error('Database delete error:', err);
            return res.status(500).send('Internal Server Error');
        }
        if (results.affectedRows === 0) {
            return res.status(404).send('Cijfer niet gevonden');
        }
        res.json({ message: 'Cijfer verwijderd' });
    });
});


// Login endpoint voor studenten

// Login endpoint voor studenten
app.post('/studenten/login', (req, res) => {
    const { email, wachtwoord } = req.body;

    console.log('Inloggen met email:', email); // Log de e-mail die wordt gebruikt om in te loggen

    // Haal de student op met het opgegeven e-mailadres
    db.query('SELECT * FROM Studenten WHERE Email = ?', [email], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        console.log('Query Result:', results); // Log de resultaten van de query
        if (results.length === 0) {
            return res.status(401).json({ message: 'Ongeldige inloggegevens' });
        }

        const student = results[0];

        // Vergelijk het wachtwoord met het gehashte wachtwoord in de database
        bcrypt.compare(wachtwoord, student.Wachtwoord, (err, match) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            console.log('Wachtwoord Match:', match); // Log of het wachtwoord overeenkomt
            if (!match) {
                return res.status(401).json({ message: 'Ongeldige inloggegevens' });
            }

            // Login succesvol, stuur de student gegevens terug
            res.json({ message: 'Login succesvol', student });
        });
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

// get student by id
app.get('/Studenten/:id', (req, res) => {
    const studentId = req.params.id;
    db.query('SELECT * FROM Studenten WHERE StudentID = ?', [studentId], (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).send('Internal Server Error');
        }
        if (results.length === 0) {
            return res.status(404).send('Student niet gevonden');
        }
        res.json(results[0]);
    });
});

// post student
app.post('/Studenten', (req, res) => {
    const { Voornaam, Tussenvoegsel, Achternaam, Wachtwoord, Email, Geboortedatum, Adres, KlasID } = req.body;

    // Hash het wachtwoord
    bcrypt.hash(Wachtwoord, 10, (err, hashedPassword) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        console.log('Gehasht Wachtwoord:', hashedPassword); // Log het gehashte wachtwoord
        // Sla het gehashte wachtwoord op in de database

        const insertQuery = 'INSERT INTO Studenten (Voornaam, Tussenvoegsel, Achternaam, Wachtwoord, Email, Geboortedatum, Adres, KlasID) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        db.query(insertQuery, [Voornaam, Tussenvoegsel, Achternaam, hashedPassword, Email, Geboortedatum, Adres, KlasID], (err, results) => {
            if (err) {
                console.error('Database insert error:', err);
                return res.status(500).send('Internal Server Error');
            }
            res.status(201).json({ message: 'Student toegevoegd', studentId: results.insertId });
        });
    });
});
// put student
app.put('/Studenten/:id', (req, res) => {
    const studentId = req.params.id;
    const { Voornaam, Tussenvoegsel, Achternaam, Wachtwoord, Email, Geboortedatum, Adres, KlasID } = req.body;

    // Huidige gegevens ophalen
    db.query('SELECT * FROM Studenten WHERE StudentID = ?', [studentId], (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).send('Internal Server Error');
        }
        if (results.length === 0) {
            return res.status(404).send('Student niet gevonden');
        }

        // Bijwerken van de gegevens
        const currentStudent = results[0];
        const updatedVoornaam = Voornaam !== undefined ? Voornaam : currentStudent.Voornaam;
        const updatedTussenvoegsel = Tussenvoegsel !== undefined ? Tussenvoegsel : currentStudent.Tussenvoegsel;
        const updatedAchternaam = Achternaam !== undefined ? Achternaam : currentStudent.Achternaam;
        const updatedWachtwoord = Wachtwoord !== undefined ? Wachtwoord : currentStudent.Wachtwoord;
        const updatedEmail = Email !== undefined ? Email : currentStudent.Email;
        const updatedGeboortedatum = Geboortedatum !== undefined ? Geboortedatum : currentStudent.Geboortedatum;
        const updatedAdres = Adres !== undefined ? Adres : currentStudent.Adres;
        const updatedKlasID = KlasID !== undefined ? KlasID : currentStudent.KlasID;

        const updateQuery = 'UPDATE Studenten SET Voornaam = ?, Tussenvoegsel = ?, Achternaam = ?, Wachtwoord = ?, Email = ?, Geboortedatum = ?, Adres = ?, KlasID = ? WHERE StudentID = ?';
        db.query(updateQuery, [updatedVoornaam, updatedTussenvoegsel, updatedAchternaam , updatedWachtwoord, updatedEmail, updatedGeboortedatum, updatedAdres, updatedKlasID, studentId], (err, results) => {
            if (err) {
                console.error('Database update error:', err);
                return res.status(500).send('Internal Server Error');
            }
            if (results.affectedRows === 0) {
                return res.status(404).send('Student niet gevonden');
            }
            res.json({ message: 'Student bijgewerkt' });
        });
    });
});
// delete student
app.delete('/Studenten/:id', (req, res) => {
    const studentId = req.params.id;
    db.query('DELETE FROM Studenten WHERE StudentID = ?', [studentId], (err, results) => {
        if (err) {
            console.error('Database delete error:', err);
            return res.status(500).send('Internal Server Error');
        }
        if (results.affectedRows === 0) {
            return res.status(404).send('Student niet gevonden');
        }
        res.json({ message: 'Student verwijderd' });
    });
});

// Post docent
app.post('/docenten', (req, res) => {
    const { Tussenvoegsel, Wachtwoord, Email, Voornaam, Vakgebied, Telefoonnummer, Achternaam } = req.body;

    // Hash het wachtwoord
    bcrypt.hash(Wachtwoord, 10, (err, hashedPassword) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        console.log('Gehasht Wachtwoord:', hashedPassword); // Log het gehashte wachtwoord
        // Sla het gehashte wachtwoord op in de database


        const query = 'INSERT INTO Docenten (Tussenvoegsel, Wachtwoord, Email, Voornaam, Vakgebied, Telefoonnummer, Achternaam) VALUES (?, ?, ?, ?, ?, ?, ?)';
        db.query(query, [Tussenvoegsel, hashedPassword, Email, Voornaam, Vakgebied, Telefoonnummer, Achternaam], (err, results) => {
            if (err) {
                console.error('Database insert error:', err); // Verbeterde foutlogging
                return res.status(500).json({ error: 'Interne serverfout' });
            }
            res.status(201).json({ message: 'Docent toegevoegd', DocentID: results.insertId });
        });
    });
});

// Login endpoint voor docenten
app.post('/docenten/login', (req, res) => {
    const { email, wachtwoord } = req.body;

    console.log('Inloggen met email:', email); // Log de email die wordt gebruikt om in te loggen

    db.query('SELECT * FROM Docenten WHERE Email = ?', [email], (err, results) => {
        if (err) {
            console.error('Database query error:', err); // Verbeterde foutlogging
            return res.status(500).json({ error: 'Interne serverfout' });
        }
        if (results.length === 0) {
            return res.status(401).json({ message: 'Ongeldige inloggegevens' });
        }

        const docent = results[0];

        bcrypt.compare(wachtwoord, docent.Wachtwoord, (err, match) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            console.log('Wachtwoord Match:', match); // Log of het wachtwoord overeenkomt
            if (!match) {
                return res.status(401).json({ message: 'Ongeldige inloggegevens' });
            }

            // Login succesvol, stuur de student gegevens terug
            res.json({ message: 'Login succesvol', docent });
        });
    });
});





// Endpoint om alle docenten op te halen
app.get('/docenten', (req, res) => {
    const query = 'SELECT * FROM Docenten';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// Endpoint om een docent op te halen op basis van ID
app.get('/docenten/:id', (req, res) => {
    const docentId = req.params.id;
    const query = 'SELECT * FROM Docenten WHERE DocentID = ?';
    db.query(query, [docentId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Docent niet gevonden' });
        }
        res.json(results[0]);
    });
});


// Endpoint om een bestaande docent bij te werken
app.put('/docenten/:id', (req, res) => {
    const docentId = req.params.id;
    const { Voornaam, Tussenvoegsel, Wachtwoord, Email, Vakgebied, Telefoonnummer, Achternaam } = req.body; // Alle velden worden verwacht in de request body

    // Stap 1: Huidige gegevens ophalen
    const getDocentQuery = 'SELECT * FROM Docenten WHERE DocentID = ?';
    db.query(getDocentQuery, [docentId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Docent niet gevonden' });
        }

        // Stap 2: Huidige gegevens gebruiken om de update-query te bouwen
        const currentDocent = results[0];
        const updatedVoornaam = Voornaam !== undefined ? Voornaam : currentDocent.Voornaam;
        const updatedTussenvoegsel = Tussenvoegsel !== undefined ? Tussenvoegsel : currentDocent.Tussenvoegsel;
        const updatedWachtwoord = Wachtwoord !== undefined ? Wachtwoord : currentDocent.Wachtwoord;
        const updatedEmail = Email !== undefined ? Email : currentDocent.Email;
        const updatedVakgebied = Vakgebied !== undefined ? Vakgebied : currentDocent.Vakgebied;
        const updatedTelefoonnummer = Telefoonnummer !== undefined ? Telefoonnummer : currentDocent.Telefoonnummer;
        const updatedAchternaam = Achternaam !== undefined ? Achternaam : currentDocent.Achternaam;

        // Stap 3: Update-query uitvoeren
        const updateQuery = 'UPDATE Docenten SET Voornaam = ?, Tussenvoegsel = ?, Wachtwoord = ?, Email = ?, Vakgebied = ?, Telefoonnummer = ?, Achternaam = ? WHERE DocentID = ?';
        db.query(updateQuery, [updatedVoornaam, updatedTussenvoegsel, updatedWachtwoord, updatedEmail, updatedVakgebied, updatedTelefoonnummer, updatedAchternaam, docentId], (err, results) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            if (results.affectedRows === 0) {
                return res.status(404).json({ message: 'Docent niet gevonden' });
            }
            res.json({ message: 'Docent bijgewerkt' });
        });
    });
});
// Endpoint om een docent te verwijderen
app.delete('/docenten/:id', (req, res) => {
    const docentId = req.params.id;
    const query = 'DELETE FROM Docenten WHERE DocentID = ?';
    db.query(query, [docentId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Docent niet gevonden' });
        }
        res.json({ message: 'Docent verwijderd' });
    });
});




app.get('/pivot_docentvakken', (req, res) => {
    const query = 'SELECT * FROM pivot__docentvakken'; // SQL query to select all from Docenten
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// get pivot by id

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

//get klassen by id
app.get('/Klassen/:id', (req, res) => {
    const klasId = req.params.id;
    db.query('SELECT * FROM Klassen WHERE KlasID = ?', [klasId], (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).send('Internal Server Error');
        }
        if (results.length === 0) {
            return res.status(404).send('Klas niet gevonden');
        }
        res.json(results[0]);
    });
});

// post klassen by id
app.post('/Klassen', (req, res) => {
    const { KlasNaam, Leerjaar } = req.body;

    const insertQuery = 'INSERT INTO Klassen (KlasNaam, Leerjaar) VALUES (?, ?)';
    db.query(insertQuery, [KlasNaam, Leerjaar], (err, results) => {
        if (err) {
            console.error('Database insert error:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.status(201).json({ message: 'Klas toegevoegd', klasId: results.insertId });
    });
});
// put klassen by id
app.put('/Klassen/:id', (req, res) => {
    const klasId = req.params.id;
    const { KlasNaam, Leerjaar } = req.body;

    // Huidige gegevens ophalen
    db.query('SELECT * FROM Klassen WHERE KlasID = ?', [klasId], (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).send('Internal Server Error');
        }
        if (results.length === 0) {
            return res.status(404).send('Klas niet gevonden');
        }

        // Bijwerken van de gegevens
        const currentKlas = results[0];
        const updatedKlasNaam = KlasNaam !== undefined ? KlasNaam : currentKlas.KlasNaam;
        const updatedLeerjaar = Leerjaar !== undefined ? Leerjaar : currentKlas.Leerjaar;

        const updateQuery = 'UPDATE Klassen SET KlasNaam = ?, Leerjaar = ? WHERE KlasID = ?';
        db.query(updateQuery, [updatedKlasNaam, updatedLeerjaar, klasId], (err, results) => {
            if (err) {
                console.error('Database update error:', err);
                return res.status(500).send('Internal Server Error');
            }
            if (results.affectedRows === 0) {
                return res.status(404).send('Klas niet gevonden');
            }
            res.json({ message: 'Klas bijgewerkt' });
        });
    });
});

// delete klassen by id
app.delete('/Klassen/:id', (req, res) => {
    const klasId = req.params.id;
    db.query('DELETE FROM Klassen WHERE KlasID = ?', [klasId], (err, results) => {
        if (err) {
            console.error('Database delete error:', err);
            return res.status(500).send('Internal Server Error');
        }
        if (results.affectedRows === 0) {
            return res.status(404).send('Klas niet gevonden');
        }
        res.json({ message: 'Klas verwijderd' });
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