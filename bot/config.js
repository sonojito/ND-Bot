require('dotenv').config();

module.exports = {
    TOKEN: process.env.DISCORD_TOKEN,
    CLIENT_ID: process.env.CLIENT_ID,
    
    // Database
    DB_HOST: process.env.DB_HOST || 'localhost',
    DB_USER: process.env.DB_USER || 'root',
    DB_PASSWORD: process.env.DB_PASSWORD || '',
    DB_NAME: process.env.DB_NAME || 'discord_bot',
    DB_PORT: parseInt(process.env.DB_PORT) || 3306,
    
    // Canali
    LOG_CHANNEL_ID: process.env.LOG_CHANNEL_ID,
    WELCOME_CHANNEL_ID: process.env.WELCOME_CHANNEL_ID,
    TICKET_CATEGORY_ID: process.env.TICKET_CATEGORY_ID,
    
    // Ruoli
    STAFF_ROLE_ID: process.env.STAFF_ROLE_ID,
    ADMIN_ROLE_ID: process.env.ADMIN_ROLE_ID,
    
    // Dashboard
    DASHBOARD_PORT: process.env.DASHBOARD_PORT || 3000,
    DASHBOARD_URL: process.env.DASHBOARD_URL || 'http://localhost:3000'
};