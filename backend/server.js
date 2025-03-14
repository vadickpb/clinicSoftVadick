const app = require('./src/app');
const db = require('./src/models'); // Importar modelos

const PORT = process.env.PORT || 3006;

// Sincronizar la base de datos y luego iniciar el servidor
db.sequelize.sync({ alter: false }) 
    .then(() => {
        console.log('🔄 Base de datos sincronizada.');
        app.listen(PORT, () => console.log(`🚀 Servidor corriendo en puerto ${PORT}`));
    })
    .catch(err => console.error('❌ Error sincronizando la base de datos:', err));