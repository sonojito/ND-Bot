const { REST, Routes } = require('discord.js');
const { TOKEN, CLIENT_ID } = require('../config');
const logger = require('../utils/logger');

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        logger.info(`✅ Bot online come ${client.user.tag}`);
        
        // Registra comandi slash
        const commands = [];
        client.commands.forEach(command => {
            commands.push(command.data.toJSON());
        });

        const rest = new REST().setToken(TOKEN);

        try {
            logger.info('Aggiornamento comandi slash...');
            await rest.put(
                Routes.applicationCommands(CLIENT_ID),
                { body: commands }
            );
            logger.info(`✅ ${commands.length} comandi slash registrati`);
        } catch (error) {
            logger.error('Errore registrazione comandi:', error);
        }

        // Log su Discord
        await logger.logToDiscord(client, 'success', '🟢 Bot Online', `Il bot ${client.user.tag} è ora online e operativo.`, [
            { name: 'Comandi', value: `${commands.length}`, inline: true },
            { name: 'Server', value: `${client.guilds.cache.size}`, inline: true },
            { name: 'Utenti', value: `${client.users.cache.size}`, inline: true }
        ]);

        // Imposta stato
        client.user.setPresence({
            activities: [{ name: 'i ticket | /help' }],
            status: 'online'
        });
    }
};