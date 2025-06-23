const express = require('express');
const router = express.Router();
const pool = require('./database');

// Get all absen
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM absensi ORDER BY id');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create new absen
router.post('/', async (req, res) => {
    const { nama, jenis_kelamin } = req.body;
    try {
        const [result] = await pool.query(
            'INSERT INTO absensi (nama, jenis_kelamin) VALUES (?, ?)',
            [nama, jenis_kelamin]
        );
        res.status(201).json({ id: result.insertId, nama, jenis_kelamin });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update absen
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { nama, jenis_kelamin } = req.body;
    try {
        await pool.query(
            'UPDATE absensi SET nama = ?, jenis_kelamin = ? WHERE id = ?',
            [nama, jenis_kelamin, id]
        );
        res.json({ id, nama, jenis_kelamin });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete absen
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM absensi WHERE id = ?', [id]);
        res.json({ message: 'Data berhasil dihapus' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
