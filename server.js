const express = require('express');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

// API pour obtenir le stock
app.get('/stock', (req, res) => {
    fs.readFile('comptes.txt', 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Erreur lors de la lecture du fichier' });
        }
        const comptes = data.trim().split('\n').filter(line => line !== '');
        res.json({ stock: comptes.length });
    });
});

// API pour générer un compte
app.post('/generate', (req, res) => {
    fs.readFile('comptes.txt', 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Erreur lors de la lecture du fichier' });
        }
        const comptes = data.trim().split('\n').filter(line => line !== '');
        if (comptes.length === 0) {
            return res.status(400).json({ error: 'Stock épuisé' });
        }
        const compte = comptes.shift(); // Retirer le premier compte
        fs.writeFile('comptes.txt', comptes.join('\n'), (err) => {
            if (err) {
                return res.status(500).json({ error: 'Erreur lors de la mise à jour du fichier' });
            }
            res.json({ compte });
        });
    });
});

// Lancer le serveur
app.listen(PORT, () => {
    console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
