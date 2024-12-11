const express = require('express');
const db = require('../db'); // Verbind met je database
const apiKeyMiddleware = require('../middlewares/ApiKeyMiddleware'); // Voeg je middleware toe indien nodig

const router = express.Router();

// Haal alle vakken op
router.get('/', apiKeyMiddleware, (req, res) => {
    const query = 'SELECT * FROM Vakken'; // SQL query om alle vakken op te halen
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// Haal vak op via ID
router.get('/:id', apiKeyMiddleware, (req, res) => {
    const vakId = req.params.id;
    db.query('SELECT * FROM Vakken WHERE VakID = ?', [vakId], (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).send('Internal Server Error');
        }
        if (results.length === 0) {
            return res.status(404).send('Vak niet gevonden');
        }
        res.json(results[0]);
    });
});

// Voeg een nieuw vak toe
router.post('/', apiKeyMiddleware, (req, res) => {
    const { VakNaam, Leerjaar } = req.body;

    const insertQuery = 'INSERT INTO Vakken (VakNaam, Leerjaar) VALUES (?, ?)';
    db.query(insertQuery, [VakNaam, Leerjaar], (err, results) => {
        if (err) {
            console.error('Database insert error:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.status(201).json({ message: 'Vak toegevoegd', vakId: results.insertId });
    });
});

// Update vak gegevens
router.put('/:id', apiKeyMiddleware, (req, res) => {
    const vakId = req.params.id;
    const { VakNaam, Leerjaar } = req.body;

    // Huidige gegevens ophalen
    db.query('SELECT * FROM Vakken WHERE VakID = ?', [vakId], (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).send('Internal Server Error');
        }
        if (results.length === 0) {
            return res.status(404).send('Vak niet gevonden');
        }

        // Bijwerken van de gegevens
        const currentVak = results[0];
        const updatedVakNaam = VakNaam !== undefined ? VakNaam : currentVak.VakNaam;
        const updatedLeerjaar = Leerjaar !== undefined ? Leerjaar : currentVak.Leerjaar;

        const updateQuery = 'UPDATE Vakken SET VakNaam = ?, Leerjaar = ? WHERE VakID = ?';
        db.query(updateQuery, [updatedVakNaam, updatedLeerjaar, vakId], (err, results) => {
            if (err) {
                console.error('Database update error:', err);
                return res.status(500).send('Internal Server Error');
            }
            if (results.affectedRows === 0) {
                return res.status(404).send('Vak niet gevonden');
            }
            res.json({ message: 'Vak bijgewerkt' });
        });
    });
});

// Verwijder vak
router.delete('/:id', apiKeyMiddleware, (req, res) => {
    const vakId = req.params.id;
    db.query('DELETE FROM Vakken WHERE VakID = ?', [vakId], (err, results) => {
        if (err) {
            console.error('Database delete error:', err);
            return res.status(500).send('Internal Server Error');
        }
        if (results.affectedRows === 0) {
            return res.status(404).send('Vak niet gevonden');
        }
        res.json({ message: 'Vak verwijderd' });
    });
});

// Exporteer de router
module.exports = router;