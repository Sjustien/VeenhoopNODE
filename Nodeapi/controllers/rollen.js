const express = require('express');
const db = require('../db'); // Verbind met je database
const apiKeyMiddleware = require('../middlewares/ApiKeyMiddleware'); // Voeg je middleware toe indien nodig

const router = express.Router();

// Haal alle rollen op
router.get('/', apiKeyMiddleware, (req, res) => {
    const query = 'SELECT * FROM Rollen'; // SQL query om alle rollen op te halen
    db.query(query, (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// Haal rol op via ID
router.get('/:id', apiKeyMiddleware, (req, res) => {
    const rolId = req.params.id;
    db.query('SELECT * FROM Rollen WHERE RolID = ?', [rolId], (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ error: err.message });
        }
        if (results.length === 0) {
            return res.status(404).send('Rol niet gevonden');
        }
        res.json(results[0]);
    });
});

// Voeg een nieuwe rol toe
router.post('/', apiKeyMiddleware, (req, res) => {
    const { RolNaam } = req.body; // Pas aan op basis van je rolstructuur

    const insertQuery = 'INSERT INTO Rollen (RolNaam) VALUES (?)';
    db.query(insertQuery, [RolNaam], (err, results) => {
        if (err) {
            console.error('Database insert error:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.status(201).json({ message: 'Rol toegevoegd', rolId: results.insertId });
    });
});

// Update rol gegevens
router.put('/:id', apiKeyMiddleware, (req, res) => {
    const rolId = req.params.id;
    const { RolNaam } = req.body; // Pas aan op basis van je rolstructuur

    // Huidige gegevens ophalen
    db.query('SELECT * FROM Rollen WHERE RolID = ?', [rolId], (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).send('Internal Server Error');
        }
        if (results.length === 0) {
            return res.status(404).send('Rol niet gevonden');
        }

        // Bijwerken van de gegevens
        const currentRol = results[0];
        const updatedRolNaam = RolNaam !== undefined ? RolNaam : currentRol.RolNaam;

        const updateQuery = 'UPDATE Rollen SET RolNaam = ? WHERE RolID = ?';
        db.query(updateQuery, [updatedRolNaam, rolId], (err, results) => {
            if (err) {
                console.error('Database update error:', err);
                return res.status(500).send('Internal Server Error');
            }
            if (results.affectedRows === 0) {
                return res.status(404).send('Rol niet gevonden');
            }
            res.json({ message: 'Rol bijgewerkt' });
        });
    });
});

// Verwijder rol
router.delete('/:id', apiKeyMiddleware, (req, res) => {
    const rolId = req.params.id;
    db.query('DELETE FROM Rollen WHERE RolID = ?', [rolId], (err, results) => {
        if (err) {
            console.error('Database delete error:', err);
            return res.status(500).send('Internal Server Error');
        }
        if (results.affectedRows === 0) {
            return res.status(404).send('Rol niet gevonden');
        }
        res.json({ message: 'Rol verwijderd' });
    });
});

// Exporteer de router
module.exports = router;