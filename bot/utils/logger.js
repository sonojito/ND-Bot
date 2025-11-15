const winston = require('winston');
const { LOG_CHANNEL_ID } = require('../config');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' }),
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        })
    ]
});

async function logToDiscord(client, type, title, description, fields = []) {
    try {
        if (!LOG_CHANNEL_ID || !client.isReady()) return;
        
        const logChannel = await client.channels.fetch(LOG_CHANNEL_ID).catch(() => null);
        if (!logChannel) return;

        const colors = {
            info: 0x3498db,
            success: 0x2ecc71,
            warning: 0xf39c12,
            error: 0xe74c3c,
            command: 0x9b59b6
        };

        const embed = {
            color: colors[type] || colors.info,
            title: title,
            description: description,
            fields: fields,
            timestamp: new Date().toISOString(),
            footer: { text: 'ND-Bot Logger' }
        };

        await logChannel.send({ embeds: [embed] });
    } catch (error) {
        logger.error('Errore nel logging su Discord:', error);
    }
}

// Esporta il logger con tutti i suoi metodi e aggiungi logToDiscord
logger.logToDiscord = logToDiscord;

module.exports = logger;