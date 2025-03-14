require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors({
    origin: 'http://localhost:3000',
    methods: 'GET,POST,PUT,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization, range', 
    credentials: true
}));

app.use(express.json({ type: 'application/json' }));
app.use(express.urlencoded({ extended: true }));

// Middleware para manejar solicitudes preflight OPTIONS
app.options('*', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.sendStatus(204);
});

const routes = require('./routes');
app.use('/api', routes); 

app.use((err, req, res, next) => {
    console.error('❌ Error global:', err.stack);
    res.status(500).json({ error: 'Algo salió mal' });
});

module.exports = app;
