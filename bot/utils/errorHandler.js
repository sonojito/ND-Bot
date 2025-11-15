const logger = require('./logger');

class ErrorHandler {
    handleError(error, client, interaction = null) {
        // Log l'errore
        logger.error('Error occurred:', {
            message: error.message,
            stack: error.stack,
            name: error.name
        });

        // Invia log su Discord
        if (client && client.isReady()) {
            logger.logToDiscord(client, 'error', '❌ Errore', error.message, [
                { name: 'Stack', value: error.stack?.substring(0, 1000) || 'N/A' }
            ]).catch(() => {});
        }

        // Rispondi all'utente se c'è un'interazione
        if (interaction) {
            const errorMessage = {
                embeds: [{
                    color: 0xe74c3c,
                    title: '❌ Errore',
                    description: 'Si è verificato un errore durante l\'esecuzione del comando. Il bot continua a funzionare normalmente.',
                    timestamp: new Date().toISOString()
                }]
            };

            if (interaction.deferred || interaction.replied) {
                interaction.editReply(errorMessage).catch(() => {});
            } else {
                interaction.reply({ ...errorMessage, ephemeral: true }).catch(() => {});
            }
        }
    }
}

module.exports = new ErrorHandler();