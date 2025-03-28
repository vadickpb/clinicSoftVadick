const { Sequelize } = require('sequelize')
require('dotenv').config()

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        logging: false
    }
)

const testConnection = async () => {
    try {
        await sequelize.authenticate()
        console.log('Conexión a la base de datos establecida.')
    } catch (error) {
        console.error('Error conectando a la base de datos:', error)
    }
};

module.exports = {sequelize, testConnection};