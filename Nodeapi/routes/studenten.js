const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../db'); // Verbind met je database
const apiKeyMiddleware = require('../middlewares/ApiKeyMiddleware'); // Voeg je middleware toe indien nodig

const router = express.Router();

// Login endpoint voor studenten
router.post('/login', apiKeyMiddleware, (req, res) => {
    const { email, wachtwoord } = req.body;
    console.log('Inloggen met email:', email);

    db.query('SELECT * FROM Studenten WHERE Email = ?', [email], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        console.log('Query Result:', results);
        if (results.length === 0) {
            return res.status(401).json({ message: 'Ongeldige inloggegevens' });
        }

        const student = results[0];

        bcrypt.compare(wachtwoord, student.Wachtwoord, (err, match) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            if (!match) {
                return res.status(401).json({ message: 'Ongeldige inloggegevens' });
            }

            res.json({ message: 'Login succesvol', student });
        });
    });
});

// Haal alle studenten op
router.get('/', apiKeyMiddleware, (req, res) => {
    db.query('SELECT * FROM Studenten', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// Haal student op via ID
router.get('/:id', apiKeyMiddleware, (req, res) => {
    const studentId = req.params.id;
    db.query('SELECT * FROM Studenten WHERE StudentID = ?', [studentId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Student niet gevonden' });
        }
        res.json(results[0]);
    });
});

// Voeg een nieuwe student toe
router.post('/', apiKeyMiddleware, (req, res) => {
    const { Voornaam, Tussenvoegsel, Achternaam, Wachtwoord, Email, Geboortedatum, Adres, KlasID } = req.body;

    bcrypt.hash(Wachtwoord, 10, (err, hashedPassword) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        const insertQuery = 'INSERT INTO Studenten (Voornaam, Tussenvoegsel, Achternaam, Wachtwoord, Email, Geboortedatum, Adres, KlasID) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        db.query(insertQuery, [Voornaam, Tussenvoegsel, Achternaam, hashedPassword, Email, Geboortedatum, Adres, KlasID], (err, results) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({ message: 'Student toegevoegd', studentId: results.insertId });
        });
    });
});

// Update student gegevens
router.put('/:id', apiKeyMiddleware, (req, res) => {
    const studentId = req.params.id;
    const { Voornaam, Tussenvoegsel, Achternaam, Wachtwoord, Email, Geboortedatum, Adres, KlasID } = req.body;

    db.query('SELECT * FROM Studenten WHERE StudentID = ?', [studentId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Student niet gevonden' });
        }

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
                return res.status(500).json({ error: err.message });
            }
            if (results.affectedRows === 0) {
                return res.status(404).json({ message: 'Student niet gevonden' });
            }
            res.json({ message: 'Student bijgewerkt' });
        });
    });
});

// Verwijder een student
router.delete('/:id', apiKeyMiddleware, (req, res) => {
    const studentId = req.params.id;
    db.query('DELETE FROM Studenten WHERE StudentID = ?', [studentId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Student niet gevonden' });
        }
        res.json({ message: 'Student verwijderd' });
    });
});

module.exports = router;  // Exporteer de router
