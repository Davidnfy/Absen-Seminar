require('dotenv').config();
const express = require('express');
const cors = require('cors');
// const bodyParser = require('body-parser');
const absenRoutes = require('./absenRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/absen', absenRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
