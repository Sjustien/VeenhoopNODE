const express = require('express');
const db = require('../db'); // Verbind met je database
const apiKeyMiddleware = require('../middlewares/ApiKeyMiddleware'); // Voeg je middleware toe indien nodig
const PDFDocument = require('pdfkit'); // Import PDFDocument van pdfkit

const router = express.Router();

// Haal alle cijfers op
router.get('/', apiKeyMiddleware, (req, res) => {
    db.query('SELECT * FROM Cijfers', (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.json(results);
    });
});

// Haal cijfer op via ID
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

// Voeg een cijfer toe
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

// Update cijfer
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

// Verwijder cijfer
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

// Route om de cijferlijst van een specifieke leerling te genereren als PDF
// Route om de cijferlijst van een specifieke leerling te genereren als PDF
router.get('/cijferlijst/:studentId', apiKeyMiddleware, (req, res) => {
    const studentId = req.params.studentId;

    // Haal de cijfers van de student op
    const cijferQuery = 'SELECT VakID, Cijfer, Blok, IngevoerdOp FROM Cijfers WHERE StudentID = ?';
    db.query(cijferQuery, [studentId], (err, cijferResults) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).send('Internal Server Error');
        }

        // Haal de vakken op
        const vakkenQuery = 'SELECT VakID, VakNaam FROM Vakken';
        db.query(vakkenQuery, (err, vakkenResults) => {
            if (err) {
                console.error('Database query error:', err);
                return res.status(500).send('Internal Server Error');
            }

            // Maak een mapping van VakID naar VakNaam
            const vakkenMap = {};
            vakkenResults.forEach(vak => {
                vakkenMap[vak.VakID] = vak.VakNaam;
            });

            // Maak een nieuwe PDF-document
            const doc = new PDFDocument();
            let filename = `cijferlijst_${studentId}.pdf`;
            filename = encodeURIComponent(filename);
            res.setHeader('Content-disposition', `attachment; filename="${filename}"`);
            res.setHeader('Content-type', 'application/pdf');

            // Begin met het schrijven van de PDF-inhoud
            doc.pipe(res); // Stuur de PDF naar de response

            // Voeg de titel toe aan de PDF
            doc.fontSize(25).text('Cijferlijst', { align: 'center' });
            doc.moveDown(3); // Meer ruimte

            // Voeg de kolomkoppen toe
            doc.fontSize(20).text('Cijfers:', { underline: true });
            doc.moveDown(2); // Meer ruimte

            // Tabelkoppen
            const tableHeaders = ['Vaknaam', 'Cijfer', 'Blok', 'Ingevoerd op'];
            const columnWidths = [300, 200, 200, 100]; // Breedtes van de kolommen
            const startX = 50; // Startpositie X
            const startY = doc.y; // Startpositie Y

            // Teken de tabelkoppen
            tableHeaders.forEach((header, index) => {
                doc.rect(startX + index * columnWidths[index], startY, columnWidths[index], 20).stroke(); // Teken de cel
                doc.fontSize(12).text(header, startX + index * columnWidths[index] + 5, startY + 5); // Voeg tekst toe
            });
            doc.moveDown(1); // Ruimte onder de koppen

            // Voeg een lijn toe onder de koppen
            doc.moveTo(startX, doc.y).lineTo(startX + columnWidths.reduce((a, b) => a + b), doc.y).stroke();
            doc.moveDown(1); // Meer ruimte

            if (cijferResults.length === 0) {
                doc.text('Geen cijfers gevonden voor deze student.', { align: 'center' });
            } else {
                cijferResults.forEach(row => {
                    const vakNaam = vakkenMap[row.VakID] || 'Onbekend vak';
                    const cijfer = row.Cijfer !== null ? row.Cijfer.toString() : 'N/A';
                    const blok = row.Blok !== null ? row.Blok.toString() : 'N/A';

                    // Verkrijg alleen de dag van de IngevoerdOp datum
                    const ingevoerdOpDate = row.IngevoerdOp ? new Date(row.IngevoerdOp) : null;
                    const ingevoerdOp = ingevoerdOpDate ? ingevoerdOpDate.toLocaleDateString() : 'N/A';

                    // Voeg de gegevens toe aan de tabel
                    const rowY = doc.y; // Huidige Y-positie voor de rij
                    const rowData = [vakNaam, cijfer, blok, ingevoerdOp];

                    rowData.forEach((data, index) => {
                        doc.rect(startX + index * columnWidths[index], rowY, columnWidths[index], 20).stroke(); // Teken de cel
                        doc.fontSize(12).text(data, startX + index * columnWidths[index] + 5, rowY + 5); // Voeg tekst toe
                    });
                    doc.moveDown(1); // Voeg extra ruimte tussen de rijen
                });
            }

            // Voeg een samenvatting toe
            doc.moveDown(3); // Meer ruimte voor de samenvatting
            doc.fontSize(20).text('Samenvatting:', { underline: true });
            doc.moveDown(2); // Ruimte voor de samenvatting

            // Bereken het gemiddelde cijfer
            const gemiddeldeCijfer = cijferResults.reduce((sum, row) => sum + (row.Cijfer || 0), 0) / cijferResults.length;
            doc.fontSize(12).text(`Gemiddeld cijfer: ${isNaN(gemiddeldeCijfer) ? 'N/A' : gemiddeldeCijfer.toFixed(2)}`, { align: 'left' });

            doc.end(); // Sluit de PDF
        });
    });
});
module.exports = router; // Exporteer de router