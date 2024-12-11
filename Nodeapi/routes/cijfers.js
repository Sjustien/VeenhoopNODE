const express = require('express');
const db = require('../db'); // Verbind met je database
const apiKeyMiddleware = require('../middlewares/ApiKeyMiddleware'); // Voeg je middleware toe indien nodig

const router = express.Router();

// Example route to fetch data from a table
router.get('/', apiKeyMiddleware, (req, res) => {
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

// Get cijfers by id
router.get('/:id', apiKeyMiddleware, (req, res) => {
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

// Post cijfers
router.post('/', apiKeyMiddleware, (req, res) => {
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

// Put cijfers
router.put('/:id', apiKeyMiddleware, (req, res) => {
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

// Delete cijfers
router.delete('/:id', apiKeyMiddleware, (req, res) => {
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

module.exports = router; // Exporteer de router