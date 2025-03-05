// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Configuración de middlewares
app.use(cors());
app.use(express.json());

// Conexión a la base de datos
const db = require('./src/models');
db.sequelize.sync()
    .then(() => console.log('Conexión a la base de datos establecida.'))
    .catch(err => console.error('Error conectando a la base de datos:', err));


const authRoutes = require('./src/routes/auth.routes');
app.use('/api/auth', authRoutes);

// Rutas de la API
const productRoutes = require('./src/routes/product.routes');  // Asumiendo que ya lo tienes
const userRoutes = require('./src/routes/user.routes');
const patientRoutes = require('./src/routes/patient.routes');

app.use('/api/productos', productRoutes);
app.use('/api/usuarios', userRoutes);
app.use('/api/pacientes', patientRoutes);

// Middleware global para manejo de errores
app.use((err, req, res, next) => {
    console.error('Error global:', err.stack);
    res.status(500).json({ error: 'Algo salió mal' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));