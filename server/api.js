const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const pool = require('./database');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

// Get attendance list
app.get('/api/absensi', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM absensi');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching attendance:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Add attendance data
app.post('/api/absensi', async (req, res) => {
    const { nama, jenisKelamin } = req.body;
    if (!nama || !jenisKelamin) {
        return res.status(400).json({ error: 'Nama and jenisKelamin are required' });
    }
    try {
        const [result] = await pool.query('INSERT INTO absensi (nama, jenisKelamin) VALUES (?, ?)', [nama, jenisKelamin]);
        res.status(201).json({ id: result.insertId, nama, jenisKelamin });
    } catch (error) {
        console.error('Error adding attendance:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.put('/api/absensi/:id', async (req, res) => {
    const { id } = req.params;
    const { nama, jenisKelamin } = req.body;
    if (!nama || !jenisKelamin) {
        return res.status(400).json({ error: 'Nama and jenisKelamin are required' });
    }
    try {
        const [result] = await pool.query('UPDATE absensi SET nama = ?, jenisKelamin = ? WHERE id = ?', [nama, jenisKelamin, id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Data not found' });
        }
        res.json({ id, nama, jenisKelamin });
    } catch (error) {
        console.error('Error updating attendance:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.delete('/api/absensi/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.query('DELETE FROM absensi WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Data not found' });
        }
        res.json({ message: 'Deleted successfully' });
    } catch (error) {
        console.error('Error deleting attendance:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`API server running at http://localhost:${port}`);
});
