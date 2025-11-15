const logger = require('../utils/logger');
const errorHandler = require('../utils/errorHandler');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (!interaction.isChatInputCommand()) return;

        const command = client.commands.get(interaction.commandName);
        if (!command) return;

        try {
            await command.execute(interaction, client);

            // Log comando eseguito
            await logger.logToDiscord(client, 'command', '📝 Comando Eseguito', `Comando: \`/${interaction.commandName}\``, [
                { name: 'Utente', value: `${interaction.user.tag} (${interaction.user.id})`, inline: true },
                { name: 'Canale', value: `${interaction.channel.name} (${interaction.channel.id})`, inline: true }
            ]);

        } catch (error) {
            errorHandler.handleError(error, client, interaction);
        }
    }
};