const express = require('express');
const db = require('../db'); // Verbind met je database
const apiKeyMiddleware = require('../middlewares/ApiKeyMiddleware'); // Voeg je middleware toe indien nodig
const PDFDocument = require('pdfkit'); // Import PDFDocument van pdfkit

const router = express.Router();

// Definieer de route voor het genereren van de PDF
router.get('/cijferlijst/:id', apiKeyMiddleware, (req, res) => {
    const studentId = req.params.id;

    // Haal de studentgegevens op
    const studentQuery = 'SELECT * FROM Studenten WHERE StudentID = ?';
    db.query(studentQuery, [studentId], (err, studentResults) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).send('Internal Server Error');
        }

        if (studentResults.length === 0) {
            return res.status(404).send('Student niet gevonden');
        }

        const student = studentResults[0];

        // Haal de cijfers van de student op
        const cijferQuery = 'SELECT VakID, Cijfer, Blok, IngevoerdOp FROM Cijfers WHERE StudentID = ?';
        db.query(cijferQuery, [studentId], (err, cijferResults) => {
            if (err) {
                console.error('Database query error:', err);
                return res.status(500).send('Internal Server Error');
            }

            // Maak een nieuwe PDF-document
            const doc = new PDFDocument();
            let filename = `cijferlijst_${studentId}.pdf`;
            filename = encodeURIComponent(filename);
            res.setHeader('Content-disposition', `attachment; filename="${filename}"`);
            res.setHeader('Content-type', 'application/pdf');

            // Begin met het schrijven van de PDF-inhoud
            doc.pipe(res); // Stuur de PDF naar de response

            // Voeg studentgegevens toe aan de PDF
            doc.fontSize(25).text('Cijferlijst', { align: 'center' });
            doc.moveDown();
            doc.fontSize(16).text(`Naam: ${student.Voornaam} ${student.Tussenvoegsel || ''} ${student.Achternaam}`);
            doc.text(`Email: ${student.Email}`);
            doc.text(`Geboortedatum: ${student.Geboortedatum}`);
            doc.moveDown();

            // Voeg de cijfers toe aan de PDF
            doc.fontSize(20).text('Cijfers:', { underline: true });
            doc.moveDown();

            if (cijferResults.length === 0) {
                doc.text('Geen cijfers gevonden voor deze student.');
            } else {
                cijferResults.forEach(row => {
                    doc.fontSize(12).text(`VakID: ${row.VakID}, Cijfer: ${row.Cijfer}, Blok: ${row.Blok}, Ingevoerd op: ${row.IngevoerdOp}`);
                });
            }

            doc.end(); // Sluit het document af
        });
    });
});

module.exports = router; // Exporteer de router