const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../db'); // Verbind met je database
const apiKeyMiddleware = require('../middlewares/ApiKeyMiddleware'); // Voeg je middleware toe indien nodig

const router = express.Router();

// POST docenten
router.post('/', apiKeyMiddleware, (req, res) => {
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
router.post('/login', apiKeyMiddleware, (req, res) => {
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

            // Login succesvol, stuur de docent gegevens terug
            res.json({ message: 'Login succesvol', docent });
        });
    });
});

// Endpoint om alle docenten op te halen
router.get('/', apiKeyMiddleware, (req, res) => {
    const query = 'SELECT * FROM Docenten';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// Endpoint om een docent op te halen op basis van ID
router.get('/:id', apiKeyMiddleware, (req, res) => {
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
router.put('/:id', apiKeyMiddleware, (req, res) => {
    const docentId = req.params.id;
    const { Voornaam, Tussenvoegsel, Wachtwoord, Email, Vakgebied, Telefoonnummer, Achternaam } = req.body;

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
router.delete('/:id', apiKeyMiddleware, (req, res) => {
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

module.exports = router; // Exporteer de router
