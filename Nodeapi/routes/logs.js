const express = require('express');
const db = require('../db'); // Verbind met je database
const apiKeyMiddleware = require('../middlewares/ApiKeyMiddleware'); // Voeg je middleware toe indien nodig

const router = express.Router();

// Haal alle logs op
router.get('/', apiKeyMiddleware, (req, res) => {
    const query = 'SELECT * FROM Logs'; // SQL query om alle logs op te halen
    db.query(query, (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// Haal log op via ID
router.get('/:id', apiKeyMiddleware, (req, res) => {
    const logId = req.params.id;
    db.query('SELECT * FROM Logs WHERE LogID = ?', [logId], (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ error: err.message });
        }
        if (results.length === 0) {
            return res.status(404).send('Log niet gevonden');
        }
        res.json(results[0]);
    });
});

// Voeg een nieuwe log toe
router.post('/', apiKeyMiddleware, (req, res) => {
    const { message, level, createdAt } = req.body; // Pas aan op basis van je logstructuur

    const insertQuery = 'INSERT INTO Logs (Message, Level, CreatedAt) VALUES (?, ?, ?)';
    db.query(insertQuery, [message, level, createdAt], (err, results) => {
        if (err) {
            console.error('Database insert error:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.status(201).json({ message: 'Log toegevoegd', logId: results.insertId });
    });
});

// Update log gegevens
router.put('/:id', apiKeyMiddleware, (req, res) => {
    const logId = req.params.id;
    const { message, level, createdAt } = req.body; // Pas aan op basis van je logstructuur

    // Huidige gegevens ophalen
    db.query('SELECT * FROM Logs WHERE LogID = ?', [logId], (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).send('Internal Server Error');
        }
        if (results.length === 0) {
            return res.status(404).send('Log niet gevonden');
        }

        // Bijwerken van de gegevens
        const currentLog = results[0];
        const updatedMessage = message !== undefined ? message : currentLog.Message;
        const updatedLevel = level !== undefined ? level : currentLog.Level;
        const updatedCreatedAt = createdAt !== undefined ? createdAt : currentLog.CreatedAt;

        const updateQuery = 'UPDATE Logs SET Message = ?, Level = ?, CreatedAt = ? WHERE LogID = ?';
        db.query(updateQuery, [updatedMessage, updatedLevel, updatedCreatedAt, logId], (err, results) => {
            if (err) {
                console.error('Database update error:', err);
                return res.status(500).send('Internal Server Error');
            }
            if (results.affectedRows === 0) {
                return res.status(404).send('Log niet gevonden');
            }
            res.json({ message: 'Log bijgewerkt' });
        });
    });
});

// Verwijder log
router.delete('/:id', apiKeyMiddleware, (req, res) => {
    const logId = req.params.id;
    db.query('DELETE FROM Logs WHERE LogID = ?', [logId], (err, results) => {
        if (err) {
            console.error('Database delete error:', err);
            return res.status(500).send('Internal Server Error');
        }
        if (results.affectedRows === 0) {
            return res.status(404).send('Log niet gevonden');
        }
        res.json({ message: 'Log verwijderd' });
    });
});

// Exporteer de router
module.exports = router;