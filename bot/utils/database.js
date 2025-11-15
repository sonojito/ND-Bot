const mysql = require('mysql2/promise');
const config = require('../config');
const logger = require('./logger');

let pool;

async function initDatabase() {
    try {
        pool = mysql.createPool({
            host: config.DB_HOST,
            user: config.DB_USER,
            password: config.DB_PASSWORD,
            database: config.DB_NAME,
            port: config.DB_PORT,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });

        // Test connessione
        const connection = await pool.getConnection();
        logger.info('✅ Database MySQL connesso con successo');
        connection.release();

        // Crea tabelle se non esistono
        await createTables();

    } catch (error) {
        logger.error('❌ Errore connessione database:', error);
        throw error;
    }
}

async function createTables() {
    const connection = await pool.getConnection();
    
    try {
        // Tabella tickets
        await connection.query(`
            CREATE TABLE IF NOT EXISTS tickets (
                id INT AUTO_INCREMENT PRIMARY KEY,
                guild_id VARCHAR(20) NOT NULL,
                channel_id VARCHAR(20) NOT NULL UNIQUE,
                user_id VARCHAR(20) NOT NULL,
                ticket_number INT NOT NULL,
                claimed BOOLEAN DEFAULT FALSE,
                claimed_by VARCHAR(20) DEFAULT NULL,
                closed BOOLEAN DEFAULT FALSE,
                closed_at DATETIME DEFAULT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_guild_user (guild_id, user_id),
                INDEX idx_closed (closed)
            )
        `);

        // Tabella warnings
        await connection.query(`
            CREATE TABLE IF NOT EXISTS warnings (
                id INT AUTO_INCREMENT PRIMARY KEY,
                guild_id VARCHAR(20) NOT NULL,
                user_id VARCHAR(20) NOT NULL,
                moderator_id VARCHAR(20) NOT NULL,
                reason TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_guild_user (guild_id, user_id)
            )
        `);

        // Tabella feedback
        await connection.query(`
            CREATE TABLE IF NOT EXISTS feedback (
                id INT AUTO_INCREMENT PRIMARY KEY,
                guild_id VARCHAR(20) NOT NULL,
                user_id VARCHAR(20) NOT NULL,
                content TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_guild (guild_id)
            )
        `);

        logger.info('✅ Tabelle database create/verificate');
    } catch (error) {
        logger.error('Errore creazione tabelle:', error);
        throw error;
    } finally {
        connection.release();
    }
}

function getPool() {
    if (!pool) {
        throw new Error('Database pool non inizializzato');
    }
    return pool;
}

module.exports = { initDatabase, getPool };