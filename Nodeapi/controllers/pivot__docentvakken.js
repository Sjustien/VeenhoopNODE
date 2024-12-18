const express = require('express');
const db = require('../db'); // Verbind met je database
const apiKeyMiddleware = require('../middlewares/ApiKeyMiddleware'); // Voeg je middleware toe indien nodig

const router = express.Router();

// Haal alle pivot_docentvakken op
router.get('/', apiKeyMiddleware, (req, res) => {
    const query = 'SELECT * FROM pivot__docentvakken'; // SQL query om alle pivot_docentvakken op te halen
    db.query(query, (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// Haal pivot_docentvak op via ID
router.get('/:id', apiKeyMiddleware, (req, res) => {
    const pivotId = req.params.id;
    db.query('SELECT * FROM pivot__docentvakken WHERE PivotID = ?', [pivotId], (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ error: err.message });
        }
        if (results.length === 0) {
            return res.status(404).send('Pivot_docentvak niet gevonden');
        }
        res.json(results[0]);
    });
});

// Voeg een nieuwe pivot_docentvak toe
router.post('/', apiKeyMiddleware, (req, res) => {
    const { DocentID, VakID } = req.body; // Pas aan op basis van je pivot_docentvakstructuur

    const insertQuery = 'INSERT INTO pivot__docentvakken (DocentID, VakID) VALUES (?, ?)';
    db.query(insertQuery, [DocentID, VakID], (err, results) => {
        if (err) {
            console.error('Database insert error:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.status(201).json({ message: 'Pivot_docentvak toegevoegd', pivotId: results.insertId });
    });
});

// Update pivot_docentvak gegevens
router.put('/:id', apiKeyMiddleware, (req, res) => {
    const pivotId = req.params.id;
    const { DocentID, VakID } = req.body; // Pas aan op basis van je pivot_docentvakstructuur

    // Huidige gegevens ophalen
    db.query('SELECT * FROM pivot__docentvakken WHERE PivotID = ?', [pivotId], (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).send('Internal Server Error');
        }
        if (results.length === 0) {
            return res.status(404).send('Pivot_docentvak niet gevonden');
        }

        // Bijwerken van de gegevens
        const currentPivot = results[0];
        const updatedDocentID = DocentID !== undefined ? DocentID : currentPivot.DocentID;
        const updatedVakID = VakID !== undefined ? VakID : currentPivot.VakID;

        const updateQuery = 'UPDATE pivot__docentvakken SET DocentID = ?, VakID = ? WHERE PivotID = ?';
        db.query(updateQuery, [updatedDocentID, updatedVakID, pivotId], (err, results) => {
            if (err) {
                console.error('Database update error:', err);
                return res.status(500).send('Internal Server Error');
            }
            if (results.affectedRows === 0) {
                return res.status(404).send('Pivot_docentvak niet gevonden');
            }
            res.json({ message: 'Pivot_docentvak bijgewerkt' });
        });
    });
});

// Verwijder pivot_docentvak
router.delete('/:id', apiKeyMiddleware, (req, res) => {
    const pivotId = req.params.id;
    db.query('DELETE FROM pivot__docentvakken WHERE PivotID = ?', [pivotId], (err, results) => {
        if (err) {
            console.error('Database delete error:', err);
            return res.status(500).send('Internal Server Error');
        }
        if (results.affectedRows === 0) {
            return res.status(404).send('Pivot_docentvak niet gevonden');
        }
 res.json({ message: 'Pivot_docentvak verwijderd' });
    });
});

// Exporteer de router
module.exports = router;