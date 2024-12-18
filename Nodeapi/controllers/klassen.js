const express = require('express');
const db = require('../db'); // Verbind met je database
const apiKeyMiddleware = require('../middlewares/ApiKeyMiddleware'); // Voeg je middleware toe indien nodig

const router = express.Router();

// Haal alle klassen op
router.get('/', apiKeyMiddleware, (req, res) => {
    const query = 'SELECT * FROM Klassen'; // SQL query om alle klassen op te halen
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// Haal klas op via ID
router.get('/:id', apiKeyMiddleware, (req, res) => {
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

// Voeg een nieuwe klas toe
router.post('/', apiKeyMiddleware, (req, res) => {
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

// Update klas gegevens
router.put('/:id', apiKeyMiddleware, (req, res) => {
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

// Verwijder klas
router.delete('/:id', apiKeyMiddleware, (req, res) => {
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

// Exporteer de router
module.exports = router;