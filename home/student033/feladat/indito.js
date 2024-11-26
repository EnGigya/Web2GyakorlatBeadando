const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
const PORT = 8033;

// Statikus fájlok
app.use(express.static(path.join(__dirname)));

// Útvonal a kezdőoldalhoz
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Szerver indítása
app.listen(PORT, () => {
    console.log(`Szerver fut a http://localhost:${PORT} címen`);
});

app.use(bodyParser.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'Erettsegi'
});

db.connect((err) => {
    if (err) {
        console.error('Adatbázis kapcsolat hiba:', err);
        return;
    }
    console.log('Adatbázis csatlakozás sikeres.');
});

// GET /uzenet végpont hozzáadása (opcionális)
app.get('/uzenet', (req, res) => {
    res.send('Ez az Üzenetküldő API POST módszerrel működik.');
});

// POST /uzenet üzenet mentése
app.post('/uzenet', (req, res) => {
    const { uzenet } = req.body;

    if (!uzenet || !uzenet.trim()) {
        return res.status(400).json({ error: 'Hibás vagy hiányzó üzenet.' });
    }

    const sql = 'INSERT INTO uzenetek (uzenet) VALUES (?)';
    db.query(sql, [uzenet.trim()], (err, result) => {
        if (err) {
            console.error('Hiba az üzenet mentésekor:', err);
            return res.status(500).json({ error: 'Hiba az üzenet mentésekor.' });
        }

        res.status(200).json({ message: 'Üzenet sikeresen elmentve.' });
    });
});
app.get('/uzenetek', (req, res) => {
    const sql = 'SELECT * FROM uzenetek';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Hiba az üzenetek lekérdezésekor:', err);
            return res.status(500).json({ error: 'Hiba az üzenetek lekérdezésekor.' });
        }
        res.json(results); // JSON válasz
    });
});
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

// CREATE: Új vizsgázó hozzáadása
app.post('/vizsgazo', (req, res) => {
    const { azon, nev, osztaly } = req.body;

    if (!azon || !nev || !osztaly) {
        return res.status(400).json({ error: 'Hiányzó mezők.' });
    }

    const sql = 'INSERT INTO vizsgazo (azon, nev, osztaly) VALUES (?, ?, ?)';
    db.query(sql, [azon, nev, osztaly], (err, result) => {
        if (err) {
            console.error('Hiba az új vizsgázó mentésekor:', err);
            return res.status(500).json({ error: 'Hiba a vizsgázó mentésekor.' });
        }
        res.status(201).json({ message: 'Vizsgázó hozzáadva.', id: result.insertId });
    });
});

// READ: Vizsgázók lekérdezése
app.get('/vizsgazo', (req, res) => {
    const sql = 'SELECT * FROM vizsgazo';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Hiba a vizsgázók lekérdezésekor:', err);
            return res.status(500).json({ error: 'Hiba a vizsgázók lekérdezésekor.' });
        }
        res.json(results);
    });
});

// UPDATE: Vizsgázó frissítése
app.put('/vizsgazo/:azon', (req, res) => {
    const { azon } = req.params;
    const { nev, osztaly } = req.body;

    if (!nev || !osztaly) {
        return res.status(400).json({ error: 'Hiányzó mezők.' });
    }

    const sql = 'UPDATE vizsgazo SET nev = ?, osztaly = ? WHERE azon = ?';
    db.query(sql, [nev, osztaly, azon], (err) => {
        if (err) {
            console.error('Hiba a vizsgázó frissítésekor:', err);
            return res.status(500).json({ error: 'Hiba a vizsgázó frissítésekor.' });
        }
        res.json({ message: 'Vizsgázó frissítve.' });
    });
});

// DELETE: Vizsgázó törlése
app.delete('/vizsgazo/:azon', (req, res) => {
    const { azon } = req.params;

    const sql = 'DELETE FROM vizsgazo WHERE azon = ?';
    db.query(sql, [azon], (err) => {
        if (err) {
            console.error('Hiba a vizsgázó törlésekor:', err);
            return res.status(500).json({ error: 'Hiba a vizsgázó törlésekor.' });
        }
        res.json({ message: 'Vizsgázó törölve.' });
    });
});

// Tantárgyak listázása
app.get('/tantargyak', (req, res) => {
    const sql = 'SELECT * FROM vizsgatargy';
    db.query(sql, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Vizsgázók és eredmények lekérdezése egy tantárgy alapján
app.get('/eredmenyek/:tantargyId', (req, res) => {
    const { tantargyId } = req.params;
    const sql = `
        SELECT 
            v.nev AS VizsgazoNeve, 
            t.nev AS Tantargy, 
            zs.szobeli AS SzobeliEredmeny, 
            zs.irasbeli AS IrasbeliEredmeny
        FROM vizsga zs
        INNER JOIN vizsgazo v ON zs.vizsgazoaz = v.azon
        INNER JOIN vizsgatargy t ON zs.vizsgatargyaz = t.azon
        WHERE t.azon = ?
    `;
    
    db.query(sql, [tantargyId], (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});





